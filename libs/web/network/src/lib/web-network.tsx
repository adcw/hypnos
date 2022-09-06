import styles from './web-network.module.css';

/* eslint-disable-next-line */
export interface WebNetworkProps {}

export function WebNetwork(props: WebNetworkProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to WebNetwork!</h1>
    </div>
  );
}

export default WebNetwork;
