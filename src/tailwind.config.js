@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

@layer base {
  body {
    font-family: 'DM Sans', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
}

@layer components {
  .btn-primary {
    @apply rounded-xl px-5 py-2.5 text-sm font-medium active:scale-95 transition-all duration-150;
    background: rgba(255,255,255,0.92);
    color: #2a1a10;
  }
  .btn-secondary {
    @apply rounded-xl px-5 py-2.5 text-sm font-medium active:scale-95 transition-all duration-150;
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.65);
    border: 1px solid rgba(255,255,255,0.14);
  }
  .btn-success {
    @apply rounded-xl px-5 py-2.5 text-sm font-medium active:scale-95 transition-all duration-150;
    background: rgba(255,255,255,0.92);
    color: #2a1a10;
  }
  .input-field {
    @apply w-full px-3 py-2 text-sm rounded-lg transition-all;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.88);
    font-family: 'DM Sans', sans-serif;
  }
  .input-field::placeholder { color: rgba(255,255,255,0.28); }
  .input-field:focus { outline: none; border-color: rgba(255,255,255,0.3); }
  .card {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.11);
    @apply rounded-2xl;
  }
  .font-serif-italic {
    font-family: 'Instrument Serif', Georgia, serif;
    font-style: italic;
  }
}

/* Today rest day — Sage + Black A */
.bg-rest {
  background: linear-gradient(160deg, #3d5c40 0%, #5a4535 50%, #111008 100%);
  min-height: 100vh;
}
/* Today workout day & Workout page — Terra + Black */
.bg-workout {
  background: linear-gradient(160deg, #8a4525 0%, #1a1210 55%, #0c0a08 100%);
  min-height: 100vh;
}
/* Trends — Sage + Black B */
.bg-trends {
  background: linear-gradient(160deg, #4a6645 0%, #2a1a10 60%, #080808 100%);
  min-height: 100vh;
}
/* History — Sage + Black B (slightly warmer) */
.bg-history {
  background: linear-gradient(160deg, #456040 0%, #301a0e 58%, #090808 100%);
  min-height: 100vh;
}

.text-w-primary { color: rgba(255,255,255,0.92); }
.text-w-secondary { color: rgba(255,255,255,0.48); }
.text-w-muted { color: rgba(255,255,255,0.3); }

.page-enter { animation: fadeUp 0.25s ease forwards; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar { width: 0px; }
