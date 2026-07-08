import type { FormEvent } from 'react';

const benefits = [
  'Подберите автомобиль под ваш бюджет',
  'Получите условия по кредиту заранее',
  'Оставьте заявку без лишних документов',
];

function App() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="page-shell">
      <div className="mobile-page">
        <section className="hero" aria-labelledby="hero-title">
          <button className="hero-close" type="button" aria-label="Закрыть">
            x
          </button>
          <div className="hero-content">
            <h1 id="hero-title">Автокредит на выгодных условиях</h1>
            <p>Оставьте заявку и получите предварительное решение.</p>
            <div className="car-placeholder" aria-label="Временное изображение автомобиля">
              Placeholder автомобиля
            </div>
          </div>
        </section>

        <section className="content" aria-label="Заявка на автокредит">
          <button className="primary-button top-cta" type="button" data-scroll-target="application-form">
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

          <section className="application-form" id="application-form" aria-labelledby="application-form-title">
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
