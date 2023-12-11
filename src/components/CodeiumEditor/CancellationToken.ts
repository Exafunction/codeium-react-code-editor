export interface CancellationToken {
  isCancellationRequested: boolean;
  // TODO(nick): fix this.
  onCancellationRequested: (callback: () => void) => void;
  // TODO(nick): find a more elegant way of doing this.
  // Hack to allow delayed registration of cancellation callback due to Monaco
  // cancellation token issues with await calls.
  cancellationCallback?: () => void;
}
