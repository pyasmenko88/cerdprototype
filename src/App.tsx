import { useRef, type FormEvent } from 'react';
import closeIcon from './assets/close.svg';
import heroCar from './assets/hero-car.png';
import heroCheck from './assets/hero-check.svg';
import statusBattery from './assets/status-battery.svg';
import statusCellular from './assets/status-cellular.svg';
import statusWifi from './assets/status-wifi.svg';

const benefits = [
  'Подберите автомобиль под ваш бюджет',
  'Получите условия по кредиту заранее',
  'Оставьте заявку без лишних документов',
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
                <img className="hero-car" src={heroCar} alt="" />
                <img className="hero-check" src={heroCheck} alt="" />
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
            {benefits.map((benefit, index) => (
              <li className="benefit-item" key={benefit}>
                <span className="benefit-icon" aria-hidden="true">
                  Icon {index + 1}
                </span>
                <span>{benefit}</span>
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
