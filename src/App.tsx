import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Moon,
  Target,
  TrendingUp,
  X,
  Zap,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Task = {
  id: number;
  title: string;
  project: string;
  date: string;
  priority: "Высокий" | "Средний" | "Низкий";
  done: boolean;
};
type Project = {
  name: string;
  color: string;
  progress: number;
  tasks: string;
  initials: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Подготовить структуру главной страницы",
    project: "Редизайн сайта",
    date: "Сегодня",
    priority: "Высокий",
    done: false,
  },
  {
    id: 2,
    title: "Согласовать пользовательский сценарий",
    project: "Мобильное приложение",
    date: "Сегодня",
    priority: "Средний",
    done: false,
  },
  {
    id: 3,
    title: "Проверить адаптивность компонентов",
    project: "Редизайн сайта",
    date: "Завтра",
    priority: "Средний",
    done: false,
  },
  {
    id: 4,
    title: "Обновить документацию API",
    project: "Внутренние инструменты",
    date: "25 ноя",
    priority: "Низкий",
    done: true,
  },
  {
    id: 5,
    title: "Собрать обратную связь команды",
    project: "Мобильное приложение",
    date: "26 ноя",
    priority: "Высокий",
    done: false,
  },
];
const projects: Project[] = [
  {
    name: "Редизайн сайта",
    color: "#a78bfa",
    progress: 78,
    tasks: "18 / 23 задач",
    initials: "RS",
  },
  {
    name: "Мобильное приложение",
    color: "#60a5fa",
    progress: 56,
    tasks: "14 / 25 задач",
    initials: "MA",
  },
  {
    name: "Внутренние инструменты",
    color: "#34d399",
    progress: 92,
    tasks: "23 / 25 задач",
    initials: "VI",
  },
];
const chartData = [
  { day: "Пн", done: 12, created: 8 },
  { day: "Вт", done: 18, created: 11 },
  { day: "Ср", done: 14, created: 9 },
  { day: "Чт", done: 25, created: 13 },
  { day: "Пт", done: 21, created: 12 },
  { day: "Сб", done: 29, created: 7 },
  { day: "Вс", done: 34, created: 10 },
];
const nav = [
  { label: "Обзор", icon: LayoutDashboard },
  { label: "Мои задачи", icon: ListTodo },
  { label: "Проекты", icon: FolderKanban },
  { label: "Аналитика", icon: Activity },
];
const today = new Intl.DateTimeFormat("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("flowdesk-tasks") || "null") ||
        initialTasks
      );
    } catch {
      return initialTasks;
    }
  });
  const [active, setActive] = useState("Обзор");
  const [filter, setFilter] = useState("Все");
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(true);
  const [modal, setModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProject, setNewProject] = useState("Редизайн сайта");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("Средний");
  const [toast, setToast] = useState("");
  const completed = tasks.filter((t) => t.done).length;
  const activeTasks = tasks.filter((t) => !t.done).length;

  useEffect(() => {
    localStorage.setItem("flowdesk-tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) => {
        const matchesFilter =
          filter === "Все" ||
          (filter === "В работе" && !t.done) ||
          (filter === "Выполнено" && t.done);
        return (
          matchesFilter &&
          `${t.title} ${t.project}`.toLowerCase().includes(query.toLowerCase())
        );
      }),
    [tasks, filter, query],
  );

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }
  function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setTasks((prev) => [
      {
        id: Date.now(),
        title: newTitle.trim(),
        project: newProject,
        date: "Сегодня",
        priority: newPriority,
        done: false,
      },
      ...prev,
    ]);
    setNewTitle("");
    setModal(false);
    setToast("Задача добавлена");
  }
  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setToast("Задача удалена");
  }

  return (
    <div className={dark ? "app-shell" : "app-shell light"}>
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Command size={19} strokeWidth={2.5} />
          </div>
          <span>
            flowdesk<span className="brand-dot">.</span>
          </span>
        </div>
        <div className="workspace-switch">
          <div className="workspace-avatar">S</div>
          <div>
            <b>Studio North</b>
            <small>Рабочее пространство</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <div className="side-label">РАБОЧЕЕ</div>
        <nav className="nav-list">
          {nav.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${active === item.label ? "selected" : ""}`}
              onClick={() => {
                setActive(item.label);
                setMobileOpen(false);
              }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.label === "Мои задачи" && <em>{activeTasks}</em>}
            </button>
          ))}
        </nav>
        <div className="side-label project-label">
          ВАШИ ПРОЕКТЫ{" "}
          <button onClick={() => setToast("Создание проекта скоро появится")}>
            <Plus size={14} />
          </button>
        </div>
        <div className="project-nav">
          {projects.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setActive("Проекты");
                setQuery(p.name);
              }}
            >
              <span className="project-dot" style={{ background: p.color }} />
              {p.name}
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Sparkles size={16} />
            </div>
            <b>Больше возможностей</b>
            <p>Планируйте работу без ограничений.</p>
            <button onClick={() => setToast("Вы уже используете демо-версию")}>
              Посмотреть планы <ArrowUpRight size={14} />
            </button>
          </div>
          <button
            className="nav-item"
            onClick={() => setToast("Справочный центр скоро появится")}
          >
            <CircleHelp size={18} />
            Помощь и поддержка
          </button>
          <button className="nav-item" onClick={() => setActive("Настройки")}>
            <Settings size={18} />
            Настройки
          </button>
          <div className="profile">
            <div className="profile-avatar">Я</div>
            <div>
              <b>Александр Я.</b>
              <small>Участник команды</small>
            </div>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-btn mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={19} />
          </button>
          <div className="breadcrumbs">
            <span>Рабочее пространство</span>
            <ChevronRight size={14} />
            <b>{active}</b>
          </div>
          <div className="top-actions">
            <label className="search-box">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск..."
              />
              <kbd>⌘ K</kbd>
            </label>
            <button
              className="icon-btn"
              title="Переключить тему"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="notification-wrap">
              <button
                className="icon-btn notification-btn"
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={18} />
                <i />
              </button>
              {notifications && (
                <div className="notification-pop">
                  <b>Уведомления</b>
                  <p>
                    <span className="notif-dot" /> У вас {activeTasks} активных
                    задач
                  </p>
                  <p>
                    <span className="notif-dot blue" /> Рабочая неделя почти
                    завершена
                  </p>
                </div>
              )}
            </div>
            <div className="top-avatar">Я</div>
          </div>
        </header>

        {active === "Настройки" ? (
          <section className="content settings-page">
            <div className="page-heading">
              <div>
                <span className="eyebrow">ПЕРСОНАЛИЗАЦИЯ</span>
                <h1>Настройки</h1>
                <p>Настройте рабочее пространство под себя.</p>
              </div>
            </div>
            <div className="panel settings-panel">
              <div>
                <b>Внешний вид</b>
                <p>Выберите тему интерфейса</p>
              </div>
              <button className="secondary-btn" onClick={() => setDark(!dark)}>
                {dark ? <Sun size={16} /> : <Moon size={16} />}
                {dark ? "Светлая тема" : "Тёмная тема"}
              </button>
              <div className="setting-divider" />
              <div>
                <b>Сохранение данных</b>
                <p>Задачи автоматически сохраняются в этом браузере.</p>
              </div>
              <span className="saved-state">
                <Check size={15} /> Включено
              </span>
              <div className="setting-divider" />
              <div>
                <b>Сбросить демо-данные</b>
                <p>Вернуть исходный список задач.</p>
              </div>
              <button
                className="danger-btn"
                onClick={() => {
                  setTasks(initialTasks);
                  setToast("Демо-данные восстановлены");
                }}
              >
                Сбросить данные
              </button>
            </div>
          </section>
        ) : active === "Аналитика" ? (
          <section className="content">
            <div className="page-heading">
              <div>
                <span className="eyebrow">ЦИФРЫ И РЕЗУЛЬТАТЫ</span>
                <h1>Аналитика</h1>
                <p>Отслеживайте темп и прогресс команды.</p>
              </div>
              <button className="secondary-btn">
                <CalendarDays size={16} /> Эта неделя <ChevronDown size={14} />
              </button>
            </div>
            <div className="stats-grid">
              <Stat
                title="Выполнено задач"
                value={String(completed + 128)}
                change="+12.8%"
                up
              />
              <Stat
                title="В работе"
                value={String(activeTasks + 24)}
                change="−4.2%"
                up={false}
              />
              <Stat title="Эффективность" value="86%" change="+8.4%" up />
              <Stat title="Время фокуса" value="32.5 ч" change="+2.5 ч" up />
            </div>
            <div className="panel chart-panel">
              <div className="panel-heading">
                <div>
                  <h3>Динамика задач</h3>
                  <p>Выполненные и созданные задачи за неделю</p>
                </div>
                <span className="chart-legend">
                  <i /> Выполнено <i className="legend-blue" /> Создано
                </span>
              </div>
              <div className="chart-wrap large-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="greenFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#a3e635"
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="100%"
                          stopColor="#a3e635"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#818cf8"
                          stopOpacity={0.18}
                        />
                        <stop
                          offset="100%"
                          stopColor="#818cf8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 5"
                      vertical={false}
                      stroke="var(--line)"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted)", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted)", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--panel)",
                        border: "1px solid var(--line)",
                        borderRadius: 12,
                        color: "var(--text)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="done"
                      name="Выполнено"
                      stroke="#a3e635"
                      strokeWidth={2.5}
                      fill="url(#greenFill)"
                    />
                    <Area
                      type="monotone"
                      dataKey="created"
                      name="Создано"
                      stroke="#818cf8"
                      strokeWidth={2}
                      fill="url(#blueFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        ) : active === "Проекты" ? (
          <section className="content">
            <div className="page-heading">
              <div>
                <span className="eyebrow">КОМАНДНАЯ РАБОТА</span>
                <h1>Проекты</h1>
                <p>Всё важное — в одном месте.</p>
              </div>
              <button
                className="primary-btn"
                onClick={() => setToast("Создание проекта скоро появится")}
              >
                <Plus size={17} /> Новый проект
              </button>
            </div>
            <div className="projects-grid">
              {projects.map((p, i) => (
                <div className="panel project-card" key={p.name}>
                  <div className="project-card-top">
                    <div
                      className="project-icon"
                      style={{ color: p.color, background: `${p.color}18` }}
                    >
                      <FolderKanban size={20} />
                    </div>
                    <button className="icon-btn">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  <h3>{p.name}</h3>
                  <p className="muted">{p.tasks}</p>
                  <div className="progress-meta">
                    <span>Прогресс</span>
                    <b>{p.progress}%</b>
                  </div>
                  <div className="progress-track">
                    <span
                      style={{ width: `${p.progress}%`, background: p.color }}
                    />
                  </div>
                  <div className="project-card-foot">
                    <div className="avatar-stack">
                      <span>Я</span>
                      <span>{["М", "А", "К"][i]}</span>
                      <span>+2</span>
                    </div>
                    <span className="muted">Обновлён сегодня</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="content">
            <div className="welcome-row">
              <div>
                <span className="eyebrow">ВТОРНИК, 25 НОЯБРЯ</span>
                <h1>
                  {active === "Мои задачи"
                    ? "Мои задачи"
                    : "Добрый день, Александр"}
                  <span className="wave">✦</span>
                </h1>
                <p>
                  {active === "Мои задачи"
                    ? "Соберите фокус и двигайтесь к результату."
                    : `Сегодня ${today}. Хороший день, чтобы сделать что-то важное.`}
                </p>
              </div>
              <button className="primary-btn" onClick={() => setModal(true)}>
                <Plus size={17} /> Добавить задачу
              </button>
            </div>
            <div className="stats-grid">
              <Stat
                title="Всего задач"
                value={String(tasks.length + 36)}
                change="+12.5%"
                up
                icon={<ListTodo size={17} />}
              />
              <Stat
                title="В работе"
                value={String(activeTasks + 8)}
                change="3 на сегодня"
                icon={<Target size={17} />}
              />
              <Stat
                title="Выполнено"
                value={String(completed + 28)}
                change="+18.2%"
                up
                icon={<CheckCheck size={17} />}
              />
              <Stat
                title="Продуктивность"
                value="92%"
                change="+6.4%"
                up
                icon={<Zap size={17} />}
              />
            </div>
            <div className="dashboard-grid">
              <div className="panel tasks-panel">
                <div className="panel-heading">
                  <div>
                    <h3>
                      {active === "Мои задачи" ? "Список задач" : "Мои задачи"}
                    </h3>
                    <p>Не теряйте фокус на главном</p>
                  </div>
                  <button
                    className="text-btn"
                    onClick={() => {
                      setActive("Мои задачи");
                      setShowAll(true);
                    }}
                  >
                    Все задачи <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="task-toolbar">
                  <div className="filter-tabs">
                    {["Все", "В работе", "Выполнено"].map((f) => (
                      <button
                        key={f}
                        className={filter === f ? "active" : ""}
                        onClick={() => setFilter(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <button
                    className="filter-icon"
                    onClick={() =>
                      setFilter(filter === "Все" ? "В работе" : "Все")
                    }
                    title="Переключить фильтр"
                  >
                    <SlidersHorizontal size={16} />
                  </button>
                </div>
                <div className="task-list">
                  {(showAll || active === "Мои задачи"
                    ? filteredTasks
                    : filteredTasks.slice(0, 4)
                  ).map((task) => (
                    <div
                      className={`task-row ${task.done ? "task-done" : ""}`}
                      key={task.id}
                    >
                      <button
                        className={`task-check ${task.done ? "checked" : ""}`}
                        onClick={() => toggleTask(task.id)}
                        aria-label="Изменить статус"
                      >
                        {task.done && <Check size={13} />}
                      </button>
                      <div className="task-main">
                        <b>{task.title}</b>
                        <span>
                          <i
                            className="mini-dot"
                            style={{
                              background:
                                projects.find((p) => p.name === task.project)
                                  ?.color || "#a78bfa",
                            }}
                          />
                          {task.project}
                        </span>
                      </div>
                      <span
                        className={`priority priority-${task.priority === "Высокий" ? "high" : task.priority === "Средний" ? "medium" : "low"}`}
                      >
                        {task.priority}
                      </span>
                      <span className="task-date">{task.date}</span>
                      <button
                        className="task-delete"
                        onClick={() => deleteTask(task.id)}
                        aria-label="Удалить задачу"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  {filteredTasks.length === 0 && (
                    <div className="empty-state">
                      <Search size={22} />
                      <b>Ничего не найдено</b>
                      <span>Попробуйте изменить запрос или фильтр.</span>
                    </div>
                  )}
                </div>
                <button
                  className="add-task-inline"
                  onClick={() => setModal(true)}
                >
                  <Plus size={16} /> Добавить новую задачу
                </button>
              </div>
              <div className="right-column">
                <div className="panel focus-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Фокус недели</h3>
                      <p>Ваш темп — отличный!</p>
                    </div>
                    <div className="focus-icon">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="focus-score">
                    <strong>
                      84<span>%</span>
                    </strong>
                    <span className="score-change">
                      <ArrowUpRight size={14} /> 8.6%
                    </span>
                  </div>
                  <div className="focus-bar">
                    <span />
                  </div>
                  <div className="focus-foot">
                    <span>На 8.6% выше прошлой недели</span>
                    <span>84 / 100</span>
                  </div>
                </div>
                <div className="panel activity-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Активность</h3>
                      <p>Ваша неделя в задачах</p>
                    </div>
                    <button className="icon-btn">
                      <MoreHorizontal size={17} />
                    </button>
                  </div>
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient
                            id="activityFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#a3e635"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="100%"
                              stopColor="#a3e635"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 5"
                          vertical={false}
                          stroke="var(--line)"
                        />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "var(--muted)", fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "var(--panel)",
                            border: "1px solid var(--line)",
                            borderRadius: 10,
                            color: "var(--text)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="done"
                          name="Задачи"
                          stroke="#a3e635"
                          strokeWidth={2.5}
                          fill="url(#activityFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-heading">
              <div>
                <h2>Ваши проекты</h2>
                <p>Следите за прогрессом команды</p>
              </div>
              <button className="text-btn" onClick={() => setActive("Проекты")}>
                Все проекты <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="projects-grid">
              {projects.slice(0, 3).map((p) => (
                <div className="panel project-card compact" key={p.name}>
                  <div className="project-card-top">
                    <div
                      className="project-icon"
                      style={{ color: p.color, background: `${p.color}18` }}
                    >
                      <FolderKanban size={19} />
                    </div>
                    <span className="project-mini-status">
                      <span /> В процессе
                    </span>
                  </div>
                  <h3>{p.name}</h3>
                  <div className="progress-meta">
                    <span>{p.tasks}</span>
                    <b>{p.progress}%</b>
                  </div>
                  <div className="progress-track">
                    <span
                      style={{ width: `${p.progress}%`, background: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <footer className="footer">
          <span>© 2025 Flowdesk. Сделано для ясности.</span>
          <span>
            <span className="online-dot" /> Все данные сохранены
          </span>
        </footer>
      </main>

      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(false);
          }}
        >
          <form className="modal" onSubmit={addTask}>
            <div className="modal-head">
              <div>
                <span className="eyebrow">НОВАЯ ЗАДАЧА</span>
                <h2>Добавить задачу</h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setModal(false)}
              >
                <X size={19} />
              </button>
            </div>
            <label className="field-label">
              Название задачи
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Например, подготовить макет..."
                required
                maxLength={100}
              />
            </label>
            <label className="field-label">
              Проект
              <select
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.name}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Приоритет
              <select
                value={newPriority}
                onChange={(e) =>
                  setNewPriority(e.target.value as Task["priority"])
                }
              >
                <option>Высокий</option>
                <option>Средний</option>
                <option>Низкий</option>
              </select>
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setModal(false)}
              >
                Отмена
              </button>
              <button className="primary-btn" type="submit">
                <Plus size={16} /> Создать задачу
              </button>
            </div>
          </form>
        </div>
      )}
      {toast && (
        <div className="toast">
          <span>
            <Check size={15} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}

function Stat({
  title,
  value,
  change,
  up,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  up?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="panel stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon">{icon || <Activity size={17} />}</div>
      </div>
      <div className="stat-bottom">
        <strong>{value}</strong>
        <span className={`stat-change ${up === false ? "neutral" : ""}`}>
          {up === false ? (
            <ArrowDownRight size={13} />
          ) : (
            <ArrowUpRight size={13} />
          )}{" "}
          {change}
        </span>
      </div>
    </div>
  );
}
export default App;
