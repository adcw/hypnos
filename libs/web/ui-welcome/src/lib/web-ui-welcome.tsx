import styles from './web-ui-welcome.module.css';

/* eslint-disable-next-line */
export interface WebUiWelcomeProps { }

export function Welcome(props: WebUiWelcomeProps) {

  const background = 'apps/hypnos-server/src/assets/public/306710379_3188621831402806_2704128125382069593_n.jpg';

  return (
    <div style={{ backgroundImage: `url(${background})`, opacity: 0.5 }}>
      <h1>Welcome to Hypnos</h1>
    </div>
  );
}

export default Welcome;
