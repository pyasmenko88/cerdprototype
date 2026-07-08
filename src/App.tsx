import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type RefObject,
} from 'react';
import benefitCar from './assets/benefit-car.svg';
import benefitClock from './assets/benefit-clock.svg';
import benefitFile from './assets/benefit-file.svg';
import closeIcon from './assets/close.svg';
import heroCar from './assets/hero-car.png';
import heroCheck from './assets/hero-check.png';

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

const fieldLabels = {
  name: 'Имя',
  phone: 'Номер телефона',
  initialPayment: 'Первоначальный взнос сум',
};

type FieldName = keyof typeof fieldLabels;

type FormValues = Record<FieldName, string>;

type IntroPhase = 'loading' | 'entering' | 'ready';

const HERO_AMOUNT_START = 85;
const HERO_AMOUNT_END = 100;
const HERO_COUNTER_DELAY = 180;
const HERO_COUNTER_DURATION = 1000;
const HERO_SCROLL_PIXELS_PER_UNIT = 24;
const HERO_SCROLL_STEP = 10;

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

type FormFieldProps = {
  name: FieldName;
  label: string;
  value: string;
  touched: boolean;
  focused: boolean;
  inputRef: RefObject<HTMLInputElement>;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  onChange: (name: FieldName, value: string) => void;
  onBlur: (name: FieldName) => void;
  onFocus: (name: FieldName) => void;
  onClear: (name: FieldName) => void;
};

function FormField({
  name,
  label,
  value,
  touched,
  focused,
  inputRef,
  inputProps,
  onChange,
  onBlur,
  onFocus,
  onClear,
}: FormFieldProps) {
  const isFilled = value.length > 0;
  const isError = touched && value.trim().length === 0;
  const isDisabled = Boolean(inputProps.disabled);
  const errorId = `${name}-error`;
  const className = [
    'form-field',
    focused && 'is-focused',
    isFilled && 'is-filled',
    isError && 'is-error',
    isDisabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(name, event.target.value);
  };

  return (
    <label className={className}>
      <span className="form-field-label">{label}</span>
      <input
        {...inputProps}
        ref={inputRef}
        name={name}
        value={value}
        aria-invalid={isError ? 'true' : undefined}
        aria-describedby={isError ? errorId : undefined}
        onChange={handleInputChange}
        onFocus={() => onFocus(name)}
        onBlur={() => onBlur(name)}
      />

      {isFilled && !isDisabled && (
        <button
          className="form-field-clear"
          type="button"
          aria-label={`Очистить поле ${label}`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onClear(name)}
        />
      )}

      {isError && (
        <span className="form-field-error" id={errorId} role="alert">
          Обязательное поле
        </span>
      )}
    </label>
  );
}

function App() {
  const applicationFormRef = useRef<HTMLElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement | null>(null);
  const heroMediaRef = useRef<HTMLDivElement | null>(null);
  const heroImageRef = useRef<HTMLImageElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const introTimeoutRef = useRef<number | null>(null);
  const introFrameRef = useRef<number | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const lockedScrollYRef = useRef(0);
  const inputRefs = {
    name: useRef<HTMLInputElement | null>(null),
    phone: useRef<HTMLInputElement | null>(null),
    initialPayment: useRef<HTMLInputElement | null>(null),
  };
  const [introPhase, setIntroPhase] = useState<IntroPhase>('loading');
  const [heroAmount, setHeroAmount] = useState(HERO_AMOUNT_START);
  const [values, setValues] = useState<FormValues>({
    name: '',
    phone: '',
    initialPayment: '',
  });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    name: false,
    phone: false,
    initialPayment: false,
  });
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const shouldLockScroll = introPhase !== 'ready';

  useEffect(() => {
    let isCancelled = false;
    let removeHeroImageListeners: (() => void) | null = null;

    const waitForMinimumLoading = () =>
      new Promise<void>((resolve) => {
        introTimeoutRef.current = window.setTimeout(() => {
          introTimeoutRef.current = null;
          resolve();
        }, 800);
      });

    const waitForHeroImage = () =>
      new Promise<void>((resolve) => {
        const image = heroImageRef.current;

        if (!image) {
          resolve();
          return;
        }

        const decodeImage = async () => {
          if ('decode' in image) {
            await image.decode().catch(() => undefined);
          }

          resolve();
        };

        if (image.complete) {
          void decodeImage();
          return;
        }

        const handleImageDone = () => {
          removeHeroImageListeners?.();
          removeHeroImageListeners = null;
          void decodeImage();
        };

        image.addEventListener('load', handleImageDone, { once: true });
        image.addEventListener('error', handleImageDone, { once: true });

        removeHeroImageListeners = () => {
          image.removeEventListener('load', handleImageDone);
          image.removeEventListener('error', handleImageDone);
        };
      });

    void Promise.allSettled([waitForMinimumLoading(), waitForHeroImage()]).then(() => {
      if (isCancelled) {
        return;
      }

      setIntroPhase('entering');

      introTimeoutRef.current = window.setTimeout(() => {
        introTimeoutRef.current = null;

        if (!isCancelled) {
          setIntroPhase('ready');
        }
      }, 1700);
    });

    return () => {
      isCancelled = true;

      if (introTimeoutRef.current !== null) {
        window.clearTimeout(introTimeoutRef.current);
        introTimeoutRef.current = null;
      }

      removeHeroImageListeners?.();
      removeHeroImageListeners = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const cancelIntroFrame = () => {
      if (introFrameRef.current !== null) {
        window.cancelAnimationFrame(introFrameRef.current);
        introFrameRef.current = null;
      }
    };

    cancelIntroFrame();

    if (introPhase === 'loading') {
      setHeroAmount(HERO_AMOUNT_START);
    } else if (
      introPhase === 'ready' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setHeroAmount(HERO_AMOUNT_END);
    } else {
      let startTime: number | null = null;

      const animateCounter = (timestamp: number) => {
        if (cancelled) {
          return;
        }

        startTime ??= timestamp;
        const elapsed = timestamp - startTime;
        const counterElapsed = elapsed - HERO_COUNTER_DELAY;
        const progress = Math.min(
          Math.max(counterElapsed / HERO_COUNTER_DURATION, 0),
          1,
        );
        const easedProgress = easeOutCubic(progress);
        const nextAmount = Math.round(
          HERO_AMOUNT_START +
            (HERO_AMOUNT_END - HERO_AMOUNT_START) * easedProgress,
        );

        setHeroAmount((currentAmount) =>
          currentAmount === nextAmount ? currentAmount : nextAmount,
        );

        if (progress === 1) {
          introFrameRef.current = null;
          return;
        }

        introFrameRef.current = window.requestAnimationFrame(animateCounter);
      };

      introFrameRef.current = window.requestAnimationFrame(animateCounter);
    }

    return () => {
      cancelled = true;
      cancelIntroFrame();
    };
  }, [introPhase]);

  useEffect(() => {
    const cancelScrollFrame = () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };

    cancelScrollFrame();

    if (introPhase !== 'ready') {
      return undefined;
    }

    const updateAmountFromScroll = () => {
      const scrollY = Math.max(window.scrollY, 0);
      const nextAmount =
        HERO_AMOUNT_END +
        Math.floor(scrollY / HERO_SCROLL_PIXELS_PER_UNIT) * HERO_SCROLL_STEP;

      setHeroAmount((currentAmount) =>
        currentAmount === nextAmount ? currentAmount : nextAmount,
      );

      scrollFrameRef.current = null;
    };

    const handleScroll = () => {
      if (scrollFrameRef.current !== null) {
        return;
      }

      scrollFrameRef.current = window.requestAnimationFrame(updateAmountFromScroll);
    };

    updateAmountFromScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelScrollFrame();
    };
  }, [introPhase]);

  useEffect(() => {
    return () => {
      if (introTimeoutRef.current !== null) {
        window.clearTimeout(introTimeoutRef.current);
      }

      if (introFrameRef.current !== null) {
        window.cancelAnimationFrame(introFrameRef.current);
      }

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!shouldLockScroll) {
      return undefined;
    }

    const { body, documentElement } = document;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyLeft = body.style.left;
    const previousBodyRight = body.style.right;
    const previousBodyWidth = body.style.width;
    const previousDocumentOverflow = documentElement.style.overflow;

    lockedScrollYRef.current = window.scrollY;
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    documentElement.style.overflow = 'hidden';

    return () => {
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.left = previousBodyLeft;
      body.style.right = previousBodyRight;
      body.style.width = previousBodyWidth;
      documentElement.style.overflow = previousDocumentOverflow;
      window.scrollTo(0, lockedScrollYRef.current);
    };
  }, [shouldLockScroll]);

  const handleTopCtaClick = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    applicationFormRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allTouched = {
      name: true,
      phone: true,
      initialPayment: true,
    };
    const firstEmptyField = (Object.keys(values) as FieldName[]).find(
      (fieldName) => values[fieldName].trim().length === 0,
    );

    setTouched(allTouched);

    if (firstEmptyField) {
      inputRefs[firstEmptyField].current?.focus({ preventScroll: true });
    }
  };

  const handleFieldChange = (name: FieldName, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleFieldFocus = (name: FieldName) => {
    setFocusedField(name);
  };

  const handleFieldBlur = (name: FieldName) => {
    setFocusedField((currentField) => (currentField === name ? null : currentField));
    setTouched((currentTouched) => ({
      ...currentTouched,
      [name]: true,
    }));
  };

  const handleFieldClear = (name: FieldName) => {
    setValues((currentValues) => ({
      ...currentValues,
      [name]: '',
    }));

    inputRefs[name].current?.focus({ preventScroll: true });
  };

  return (
    <main className="page-shell">
      <div className="mobile-page" data-intro-phase={introPhase}>
        {introPhase !== 'ready' && (
          <div
            className="intro-overlay"
            role="status"
            aria-live="polite"
            aria-label="Загрузка"
          >
            <div className="intro-spinner" aria-hidden="true" />
            <span className="visually-hidden">Загрузка</span>
          </div>
        )}

        <section className="hero" aria-labelledby="hero-title">
          <nav className="hero-navigation" aria-label="Навигация">
            <button className="hero-close" type="button" aria-label="Закрыть">
              <img src={closeIcon} alt="" />
            </button>
          </nav>

          <div className="hero-content">
            <div className="hero-copy">
              <h1
                id="hero-title"
                ref={heroTitleRef}
                aria-label={
                  introPhase === 'ready'
                    ? `от ${heroAmount} млн сум`
                    : 'от 100 млн сум'
                }
              >
                от{' '}
                <span className="hero-amount" aria-hidden="true">
                  {heroAmount}
                </span>{' '}
                млн сум
              </h1>
              <p ref={heroSubtitleRef}>на покупку автомобиля</p>
            </div>

            <div className="hero-media" ref={heroMediaRef} aria-hidden="true">
              <div className="hero-car-stage">
                <img
                  className="hero-car"
                  ref={heroImageRef}
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

        <section className="content" ref={contentRef} aria-label="Заявка на автокредит">

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
              <div className="form-fields">
                <FormField
                  name="name"
                  label={fieldLabels.name}
                  value={values.name}
                  touched={touched.name}
                  focused={focusedField === 'name'}
                  inputRef={inputRefs.name}
                  inputProps={{
                    type: 'text',
                    autoComplete: 'name',
                  }}
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                  onBlur={handleFieldBlur}
                  onClear={handleFieldClear}
                />

                <FormField
                  name="phone"
                  label={fieldLabels.phone}
                  value={values.phone}
                  touched={touched.phone}
                  focused={focusedField === 'phone'}
                  inputRef={inputRefs.phone}
                  inputProps={{
                    type: 'tel',
                    inputMode: 'tel',
                    autoComplete: 'tel',
                  }}
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                  onBlur={handleFieldBlur}
                  onClear={handleFieldClear}
                />

                <FormField
                  name="initialPayment"
                  label={fieldLabels.initialPayment}
                  value={values.initialPayment}
                  touched={touched.initialPayment}
                  focused={focusedField === 'initialPayment'}
                  inputRef={inputRefs.initialPayment}
                  inputProps={{
                    type: 'text',
                    inputMode: 'numeric',
                  }}
                  onChange={handleFieldChange}
                  onFocus={handleFieldFocus}
                  onBlur={handleFieldBlur}
                  onClear={handleFieldClear}
                />
              </div>

              <div className="form-actions">
                <button className="primary-button" type="submit">
                  Оставить заявку
                </button>

                <p className="consent-text">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </div>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}

export default App;
