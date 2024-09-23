interface Order {
  orderStatus: string;
  createdAt: Date;
}

export interface UserCycleResult {
  finished: boolean;
  cycleTime: number | null;
}

export function calculateUserCycleTime(
  orders: Order[],
  startStatus: string,
  endStatus: string,
): UserCycleResult {
  let startJob: number | null = null;
  let endJob: number | null = null;

  const now = new Date().getTime();
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    if (order.orderStatus === startStatus && !startJob) {
      startJob = new Date(order.createdAt).getTime();
    }

    if (order.orderStatus === endStatus && startJob) {
      endJob = new Date(order.createdAt).getTime();
      const cycleTime = endJob - startJob;
      const userResult: UserCycleResult = {
        finished: true,
        cycleTime: cycleTime,
      };
      return userResult;
    }
  }

  if (startJob) {
    const cycleTime = now - startJob;
    const userResult: UserCycleResult = {
      finished: false,
      cycleTime: cycleTime,
    };
    return userResult;
  }

  const userResult: UserCycleResult = {
    finished: false,
    cycleTime: null,
  };
  return userResult;
}
