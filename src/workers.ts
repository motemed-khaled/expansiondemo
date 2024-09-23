import cluster from 'cluster';
import os from 'os';

const cpuCount = os.cpus().length;

console.log(`Primary PID: ${process.pid}`);

if (cluster.isPrimary) {
  console.log('Primary process is running');

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} has been killed`);
    console.log('Starting another worker');
    cluster.fork();
  });
} else {
  console.log(`Worker process started with PID: ${process.pid}`);
  import('./index');
}
