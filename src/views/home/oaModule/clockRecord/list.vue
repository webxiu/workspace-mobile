<script lang="tsx">
import dayjs, { Dayjs } from "dayjs";
import { formatDate } from "@/utils/common";
import { getLoginInfo } from "@/utils/storage";
import { ref, onMounted, computed, reactive, nextTick, h, defineComponent } from "vue";
import { attendanceRecordAllList, AttendanceRecordMulItemType } from "@/api/oaModule";
import { useUtils } from "@/components/HxDrawer/useUtils";
import { closeToast, showLoadingToast } from "vant";
import { addDialog } from "@/components/ReDialog";

type ListItemType = {
  date: string;
  staffName: string;
  staffCode: string;
  deptName: string;
  list: AttendanceRecordMulItemType[];
};

export default defineComponent({
  props: {},
  emits: ["submit", "reset", "change"],
  setup(props, { emit, expose, attrs, slots }) {
    const moveRef = ref();
    const calendarRef = ref();
    const loading = ref(false);
    const showPicker = ref(false);
    const monthDate = ref(dayjs());
    const loginInfo = getLoginInfo();
    const dataList = ref<ListItemType[]>([]);
    const endDate = dayjs().format("YYYY-MM-DD");
    const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const minDate = new Date(dayjs().subtract(5, "year").format("YYYY-MM-DD"));
    const maxDate = new Date(dayjs().format("YYYY-MM-DD"));
    const exceptionList = ref<{ [key in "fives" | "fifteens" | "thirties"]: any[] }>({ fives: [], fifteens: [], thirties: [] });
    const formData = reactive({ page: 1, limit: 10000, staffCode: loginInfo.userCode, startDate: startDate, endDate: endDate });
    const itemList = reactive([
      { label: "打卡时间", value: "attTime", formatLabel: (m) => getTimeName(m.attTime), format: (m) => formatDate(m.attTime, "HH:mm:ss") }
      // { label: "考勤机", value: "attMachineName" }
    ]);

    const timeNames = [
      { start: 7, end: 11, name: "上午" },
      { start: 11, end: 15, name: "中午" },
      { start: 15, end: 19, name: "下午" },
      { start: 19, end: 23, name: "晚上" }
    ];

    const lateCount = 3; //允许迟到次数
    const lateMinute = 5; // 允许迟到分钟
    const sms = 30; // 上班开始分钟
    const exceptionRanges = [
      { hours: [8, 13], minutes: [sms, sms + 5], cate: "fives" },
      { hours: [8, 13], minutes: [sms + 5, sms + 15], cate: "fifteens" },
      { hours: [8, 13], minutes: [sms + 15, sms + 30], cate: "thirties" }
    ];

    const dateRange = computed(() => `${formData.startDate} ~ ${formData.endDate}`);
    const hasException = computed(() => {
      const { fives, fifteens, thirties } = exceptionList.value;
      return fives.length || fifteens.length || thirties.length;
    });

    onMounted(() => {
      getData();
      useUtils(moveRef.value, ({ el, deltaX, duration, direction }) => {
        if (["up", "down"].includes(direction)) return;
        const distance = Math.abs(deltaX);
        const type = direction === "right" ? "subtract" : "add";
        if ((duration < 300 && distance > 10) || distance > window.innerWidth / 3) {
          onSwithMonth(type);
        }
      });
    });

    const onRefresh = () => {
      formData.staffCode = loginInfo.userCode;
      formData.startDate = startDate;
      formData.endDate = endDate;
      monthDate.value = dayjs();
      getData();
    };

    function getTimeName(time: string) {
      const date = new Date(time);
      const hour = date.getHours();
      const timeSlot = timeNames.find(({ start, end }) => hour >= start && hour < end);
      return timeSlot ? timeSlot.name : "其他";
    }

    function getLastMonthRange(now: Dayjs, fmt = "YYYY-MM-DD") {
      const start = now.startOf("month").format(fmt);
      const end = now.endOf("month").format(fmt);
      return { start, end };
    }

    const onSwithMonth = (type: "add" | "subtract") => {
      monthDate.value = monthDate.value[type](1, "month");
      const { start, end } = getLastMonthRange(monthDate.value);
      formData.startDate = start;
      formData.endDate = end;
      getData();
    };
    const onOpen = () => {
      showPicker.value = true;
      nextTick(() => {
        const dateArr = [new Date(formData.startDate), new Date(formData.endDate)];
        calendarRef.value?.reset(dateArr);
      });
    };

    const onConfirm = (data) => {
      formData.startDate = dayjs(data[0]).format("YYYY-MM-DD");
      formData.endDate = dayjs(data[1]).format("YYYY-MM-DD");
      showPicker.value = false;
      getData();
    };

    /**
     * 获取异常打卡列表
     * @param list 打卡列表
     * @param date 打卡日期
     */
    function getExceptionList(list: AttendanceRecordMulItemType[], date: string) {
      list.filter((item: any) => {
        exceptionRanges.forEach(({ hours, minutes: min, cate }) => {
          if (hours.includes(item.hour) && item.minute > min[0] && item.minute <= min[1]) {
            exceptionList.value[cate].push(item);
          }
        });
      });
    }

    function getTime(time: string) {
      const itemTime = new Date(time);
      const hour = itemTime.getHours();
      const minute = itemTime.getMinutes();
      const second = itemTime.getSeconds();
      return { hour, minute, second };
    }

    // 获取列表
    function getData() {
      loading.value = true;
      showLoadingToast({ message: "加载中...", loadingType: "spinner", forbidClick: true });
      attendanceRecordAllList(formData)
        .then(({ data }) => {
          if (!data?.records) data.records = [];
          exceptionList.value.fives = [];
          exceptionList.value.fifteens = [];
          exceptionList.value.thirties = [];
          const cateList = data?.records.reduce((acc, user) => {
            const dateKey = dayjs(user.attTime).format("YYYY-MM-DD");
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(user);
            return acc;
          }, {});
          const formattedList = Object.keys(cateList).map((date) => {
            const list = cateList[date].map((item) => ({ ...item, ...getTime(item.attTime) })).reverse();
            const { staffName, staffCode, deptName } = list[0] || ({} as ListItemType);
            getExceptionList(list, date);
            return { date: date, staffName, staffCode, deptName, list };
          });
          dataList.value = formattedList;
        })
        .finally(() => {
          loading.value = false;
          closeToast();
        });
    }

    /**
     * 获取迟到总分钟和总秒数
     * @param laterList 迟到列表
     * @param count 允许迟到次数(默认3)
     * @param time 允许迟到分钟(默认5)
     */
    function getTotalTime(laterList, count = 3, time = 5) {
      const result = laterList.reduce(
        (acc, item) => {
          const timeOut = item.minute - sms;
          if (timeOut <= time && count > 0) {
            count--;
            return acc;
          }
          acc.totalMin += timeOut;
          acc.totalSec += item.second;
          return acc;
        },
        { totalMin: 0, totalSec: 0 }
      );
      return result;
    }

    const onException = () => {
      const { fives, fifteens, thirties } = exceptionList.value;
      const resultDialog = addDialog({
        title: "异常打卡",
        show: true,
        lockScroll: true,
        showCancelButton: true,
        showConfirmButton: false,
        contentRender: () => {
          // 获取迟到总分钟和秒
          const getMinutes = (list) => {
            return list.reduce(
              (acc, item) => {
                acc.min += item.minute - sms;
                acc.sec += item.second;
                return acc;
              },
              { min: 0, sec: 0 }
            );
          };
          const Comp = ({ list, title }) => {
            const { min, sec } = getMinutes(list);
            return (
              <>
                <van-divider content-position="left" style="margin-bottom: 0px">
                  {title}分钟内打卡 ({min}分钟{sec}秒)
                </van-divider>
                {list.length ? (
                  list.map((item) => (
                    <div key={item.id} class="flex just-center mb-5 p-10">
                      <div class="ui-ovx-a">
                        <div class="ui-ta-c">
                          <van-tag size="small" type="primary" class="mr-10">
                            {getTimeName(item.attTime)}
                          </van-tag>
                          <van-tag size="small" type={item.minute > 35 ? "danger" : "warning"} plain>
                            {dayjs(item.attTime).format("YYYY-MM-DD HH:mm:ss")}
                          </van-tag>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div class="ui-ta-c fz-28">暂无记录</div>
                )}
              </>
            );
          };
          const result = getTotalTime([...fives, ...fifteens, ...thirties], lateCount, lateMinute); // 获取迟到总分钟和总秒数
          return h(
            <div class="p-20">
              <div class="ui-ta-c fz-32 color-f60">
                迟到总时长: {result.totalMin}分钟{result.totalSec}秒
              </div>
              <Comp title="1-5" list={fives} />
              <Comp title="5-15" list={fifteens} />
              <Comp title="15-30" list={thirties} />
              <div class="ui-ta-c fz-24 color-bbb mt-20">
                3次5分钟以内/次, 不作处理
                <br />
                1-15分钟, 扣除30分钟工资
                <br />
                15-30分钟, 扣除1小时工资，以此类推
              </div>
            </div>,
            { onSubmit: () => (resultDialog.options.value.show = false) }
          );
        }
      });
    };

    return () => (
      <div class="wrap flex-col ui-h-100">
        <van-sticky>
          <div class="flex just-around align-center border-line-bottom">
            <van-field v-model={dateRange.value} readonly name="datePicker" input-align="center" placeholder="点击选择" onClick={onOpen} class="fz-28" />
            <van-button type="warning" size="small" onClick={onException} class="no-wrap mr-20" style={{ display: hasException.value ? "block" : "none" }}>
              异常
            </van-button>
          </div>
        </van-sticky>
        <van-pull-refresh v-model={loading.value} onRefresh={onRefresh} class="flex-1 ui-ovy-a">
          <div ref={moveRef} class="ui-w-100 ui-h-100">
            {dataList.value.length > 0 ? (
              <van-list finished-text="没有更多了" finished={true} class="p-20 box-border">
                <div class="mb-20 flex just-between">
                  <van-tag type="danger" class="flex-1" size="large">
                    <span>姓名:{dataList.value[0].staffName}</span>
                    <span style="margin: auto">工号: {dataList.value[0].staffCode}</span>
                    <span>部门: {dataList.value[0].deptName}</span>
                  </van-tag>
                </div>
                {dataList.value.map((item, index) => {
                  const { list, date } = item;
                  const lateList = list.filter((record: any) => [8, 13].includes(record.hour) && record.minute > sms) || [];
                  const isLateTime = lateList.map((record: any) => `${record.minute - sms}:${record.second}`).join(",");
                  return (
                    <van-cell key={date} class="border-line mb-10 border-10" style="padding: 4px">
                      <div class="ui-ovx-a">
                        <div class="flex just-between">
                          <span>
                            <van-tag type="primary">{dataList.value.length - index}</van-tag>
                            <van-tag type="primary" class="ml-10" plain>
                              {date}
                            </van-tag>
                            <van-tag type={list.length < 4 ? "danger" : "success"} class="ml-60" plain>
                              打卡: {list.length}次
                            </van-tag>
                            <van-tag type="danger" class="ml-60" plain style={{ display: lateList.length ? "inline-block" : "none" }}>
                              迟到: {isLateTime}
                            </van-tag>
                          </span>
                        </div>
                        <div class="flex flex-wrap fz-26">
                          {list.map((record) => (
                            <div key={record.id} class="flex color-333">
                              {itemList.map((cell, idx) => (
                                <div key={idx} class="flex color-333 mr-10">
                                  <span class="ellipsis">
                                    <span class="label-colon">{cell.formatLabel?.(record) || cell.label}</span>
                                    <span>{cell.format?.(record) || record[cell.value]}</span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </van-cell>
                  );
                })}
              </van-list>
            ) : (
              <van-empty description="暂无数据" />
            )}
            <van-back-top />
          </div>
        </van-pull-refresh>

        <van-popup v-model:show={showPicker.value} position="bottom">
          <van-calendar
            type="range"
            ref={calendarRef}
            show-mark={false}
            min-date={minDate}
            max-date={maxDate}
            v-model:show={showPicker.value}
            onConfirm={onConfirm}
            onCancel={() => (showPicker.value = false)}
          />
        </van-popup>
      </div>
    );
  }
});
</script>
