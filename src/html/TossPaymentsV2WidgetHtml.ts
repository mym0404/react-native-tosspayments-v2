export const TossPaymentsV2WidgetHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      name="viewport"
      charset="UTF-8"
    />
    <title>Toss Payments V2 Widget</title>
    <script src="https://js.tosspayments.com/v2/standard"></script>
    <style></style>
  </head>
  <body>
    <div id="payment-method"></div>

    <script>
      const PARAMS = {};

      function sendMessageToRN(data) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }

      function setParam(key, value) {
        PARAMS[key] = value;
      }

      async function init() {
        const button = document.getElementById('payment-button');
        const coupon = document.getElementById('coupon-box');
        // ------  결제위젯 초기화 ------
        const clientKey = PARAMS['clientKey'];
        const tossPayments = TossPayments(clientKey);
        // 회원 결제
        const customerKey = PARAMS['customerKey'];
        const widgets = tossPayments.widgets({
          customerKey,
        });
        // 비회원 결제
        // const widgets = tossPayments.widgets({ customerKey: TossPayments.ANONYMOUS });

        // ------ 주문의 결제 금액 설정 ------
        await widgets.setAmount({
          currency: 'KRW',
          value: 50000,
        });

        // ------  결제 UI 렌더링 ------
        await widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        });

        // ------  이용약관 UI 렌더링 ------
        await widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        });

        // ------  주문서의 결제 금액이 변경되었을 경우 결제 금액 업데이트 ------
        coupon.addEventListener('change', async function () {
          if (coupon.checked) {
            await widgets.setAmount({
              currency: 'KRW',
              value: amount.value - 5000,
            });

            return;
          }

          await widgets.setAmount({
            currency: 'KRW',
            value: amount,
          });
        });

        // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
        button.addEventListener('click', async function () {
          await widgets.requestPayment({
            orderId: 'QXc9mrYV_vdztxsIQwVg9',
            orderName: '토스 티셔츠 외 2건',
            successUrl: window.location.origin + '/success.html',
            failUrl: window.location.origin + '/fail.html',
            customerEmail: 'customer123@gmail.com',
            customerName: '김토스',
            customerMobilePhone: '01012341234',
          });
        });
      }
    </script>
  </body>
</html>
`;