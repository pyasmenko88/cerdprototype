import { useRef, type FormEvent } from 'react';
import benefitCar from './assets/benefit-car.svg';
import benefitClock from './assets/benefit-clock.svg';
import benefitFile from './assets/benefit-file.svg';
import closeIcon from './assets/close.svg';
import heroCar from './assets/hero-car.png';
import heroCheck from './assets/hero-check.png';
import statusBattery from './assets/status-battery.svg';
import statusCellular from './assets/status-cellular.svg';
import statusWifi from './assets/status-wifi.svg';

const benefits = [
  {
    text: 'Оставьте заявку всего за 1 минуту',
    icon: benefitClock,
  },
  {
    text: 'Поможем подобрать автомобиль',
    icon: benefitCar,
  },
  {
    text: 'Оформление и выдача авто за 1 день',
    icon: benefitFile,
  },
];

function App() {
  const applicationFormRef = useRef<HTMLElement | null>(null);

  const handleTopCtaClick = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    applicationFormRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="page-shell">
      <div className="mobile-page">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-status-bar" aria-hidden="true">
            <span className="hero-status-time">9:41</span>
            <span className="hero-status-icons">
              <img src={statusCellular} alt="" />
              <img src={statusWifi} alt="" />
              <img src={statusBattery} alt="" />
            </span>
          </div>

          <nav className="hero-navigation" aria-label="Навигация">
            <button className="hero-close" type="button" aria-label="Закрыть">
              <img src={closeIcon} alt="" />
            </button>
          </nav>

          <div className="hero-content">
            <div className="hero-copy">
              <h1 id="hero-title">от 100 млн сум</h1>
              <p>на покупку автомобиля</p>
            </div>

            <div className="hero-media" aria-hidden="true">
              <div className="hero-car-stage">
                <img
                  className="hero-car"
                  src={heroCar}
                  alt=""
                  width="390"
                  height="247"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
                <img
                  className="hero-check"
                  src={heroCheck}
                  alt=""
                  width="184"
                  height="184"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="content" aria-label="Заявка на автокредит">
          <button
            className="primary-button top-cta"
            type="button"
            onClick={handleTopCtaClick}
          >
            Оставить заявку
          </button>

          <ul className="benefits-list" aria-label="Преимущества">
            {benefits.map((benefit) => (
              <li className="benefit-item" key={benefit.text}>
                <span className="benefit-icon" aria-hidden="true">
                  <img src={benefit.icon} alt="" width="24" height="24" />
                </span>
                <span className="benefit-text">{benefit.text}</span>
              </li>
            ))}
          </ul>

          <section
            className="application-form"
            id="application-form"
            ref={applicationFormRef}
            aria-labelledby="application-form-title"
          >
            <h2 id="application-form-title">Заполните заявку — мы свяжемся с вами</h2>

            <form onSubmit={handleSubmit}>
              <label>
                Имя
                <input type="text" name="name" autoComplete="name" />
              </label>

              <label>
                Телефон
                <input type="tel" name="phone" inputMode="tel" autoComplete="tel" />
              </label>

              <label>
                Первоначальный взнос
                <input type="text" name="initialPayment" inputMode="numeric" />
              </label>

              <button className="primary-button" type="submit">
                Оставить заявку
              </button>

              <p className="consent-text">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
              </p>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}

export default App;
