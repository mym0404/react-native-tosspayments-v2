import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TossPaymentsV2Widget } from 'react-native-tosspayments-v2';

function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TossPaymentsV2Widget
        clientKey={'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'}
        customerKey={'ANONYMOUS'}
        style={{ flex: 1 }}
        webViewProps={{
          onLoad: ({ nativeEvent }) => {
            console.log(`onLoad, ${JSON.stringify(nativeEvent, null, 2)}`);
          },
          onError: ({ nativeEvent }) => {
            console.log(`onError, ${nativeEvent}`);
          },
        }}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}
