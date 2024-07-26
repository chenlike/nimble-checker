
declare global {
  interface Window {
    cfCallBack: (value: string) => void;
  }
}