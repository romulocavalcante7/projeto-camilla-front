export const copyImageToClipboard = async (
  dataURL: string | undefined,
  done: () => void,
  failed: (error: any) => void
) => {
  try {
    if (!dataURL) return;
    const makeImagePromise = async () => {
      const response = await fetch(dataURL);
      const blob = await response.blob();
      return blob;
    };
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': makeImagePromise()
      })
    ]);
    done();
  } catch (err) {
    failed(err);
  }
};
