<template>
  <div class="section page1">
    <div class="bg-img">
      <img src="@/assets/report/bg01.png" />
    </div>
    <div class="bg-star">
      <img src="@/assets/report/page1_star.gif" />
    </div>
    <div class="content">
      <div class="text-wrap flex-1 ui-w-100">
        <div style="padding: 50px 0 10px">xxx公司年度报告</div>
        <div class="ui-ta-c">
          <div class="mb-10">不负韶华 幸运有你</div>
          <div class="fz-80 mb-10">INVITATION</div>
          <div>- 携/手/共/赴 - 辉/煌/未/来 -</div>
        </div>
        <div class="ui-ta-c">
          <div class="fz-60 mb-10">[ 邀请函 ]</div>
          <div class="mb-10">- 商务会议/新品发布/招商加盟 -</div>
          <div>be grateful to have you</div>
        </div>
        <div class="ui-ta-c">
          <div class="roll_ball flex just-center">
            <div class="element-box">
              <img
                class="comp_image editable-image"
                src="@/assets/report/rotate_ball.png"
              />
            </div>
            <div class="begin-btn">上滑</div>
          </div>
        </div>
        <div class="ui-ta-c">
          <div class="fz-28 mb-10">年度统计</div>
          <div class="fz-26 mb-10">主体：xxx有限责任公司</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.page1 {
  .bg-img {
    position: absolute;
    top: 0;
    left: 0;
  }
  .bg-star {
    position: absolute;
    width: 100%;
    height: 100%;
    color: rgb(103, 103, 103);
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 0px;
    animation: 1s ease 0s 1 normal both running puffIn;
    img {
      opacity: 0.5;
    }
  }

  .content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    .text-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
  }
  .roll_ball {
    position: relative;
    width: 100%;
    padding-bottom: 20px;
    .begin-btn {
      position: absolute;
      top: 45%;
      left: 50%;
      animation: scaleBtn 1s infinite alternate;
    }
  }
  .element-box {
    width: 200px;
    height: 200px;
    filter: brightness(2) contrast(100%) saturate(100%) hue-rotate(0deg)
      blur(0px);
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 0px;
    animation: 4s linear 0s infinite normal both running rotateIn;
    .comp_image {
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes scaleBtn {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    transform: translate(-50%, -50%) scale(1.3);
  }
}
@keyframes puffIn {
  0% {
    opacity: 0;
    transform-origin: 50% 50%;
    transform: scale(2);
  }

  to {
    opacity: 1;
    transform-origin: 50% 50%;
    transform: scale(1);
  }
}

@keyframes rotateIn {
  0% {
    transform-origin: center;
    transform: rotate(-360deg);
  }

  to {
    transform-origin: center;
  }
}
</style>
