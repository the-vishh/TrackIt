// AI Expense Tracker - Complete JavaScript Implementation
class ExpenseTracker {
  constructor() {
    this.expenses = this.loadFromStorage("expenses") || [];
    this.goals = this.loadFromStorage("goals") || this.getDefaultGoals();
    this.settings =
      this.loadFromStorage("settings") || this.getDefaultSettings();
    this.chart = null;
    this.currentLocation = null;
    this.watchId = null;
    this.displayedExpensesCount = 10;

    this.init();
  }

  // Use in-memory storage instead of localStorage for Claude.ai compatibility
  loadFromStorage(key) {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch {
        return null;
      }
    }
    // Fallback to in-memory storage
    if (!this.storage) this.storage = {};
    return this.storage[key] || null;
  }

  saveToStorage(key, data) {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch {
        // Fallback to in-memory
        if (!this.storage) this.storage = {};
        this.storage[key] = data;
      }
    } else {
      if (!this.storage) this.storage = {};
      this.storage[key] = data;
    }
  }

  init() {
    this.setupEventListeners();
    this.setupGeolocation();
    this.requestNotificationPermission();
    this.updateDashboard();
    this.renderExpenses();
    this.updateChart();
    this.updateTree();
    this.updateInsights();
    this.setupServiceWorker();
  }

  getDefaultGoals() {
    return [
      {
        id: 1,
        title: "Save $500 this month",
        target: 500,
        current: 320,
        type: "savings",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        title: "Coffee budget: $30/week",
        target: 30,
        current: 18,
        type: "category",
        category: "coffee",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  getDefaultSettings() {
    return {
      monthlyBudget: 2000,
      notifications: true,
      locationTracking: true,
      aiInsights: true,
      currency: "USD",
    };
  }

  setupEventListeners() {
    // AI Input Processing
    document
      .getElementById("processBtn")
      .addEventListener("click", () => this.processAIInput());
    document.getElementById("aiInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        this.processAIInput();
      }
    });

    // Voice Input
    document
      .getElementById("voiceBtn")
      .addEventListener("click", () => this.startVoiceInput());

    // Receipt Scanner
    document
      .getElementById("receiptBtn")
      .addEventListener("click", () => this.scanReceipt());

    // Quick Add Buttons
    document.querySelectorAll(".quick-add-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.quickAdd(e.target.dataset.category)
      );
    });

    // Chart Controls
    document.querySelectorAll(".chart-period").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.changePeriod(e.target.dataset.period)
      );
    });

    // Search and Filter
    document
      .getElementById("searchExpenses")
      .addEventListener("input", () => this.filterExpenses());
    document
      .getElementById("filterCategory")
      .addEventListener("change", () => this.filterExpenses());

    // Header Actions
    document
      .getElementById("settingsBtn")
      .addEventListener("click", () => this.openSettings());
    document
      .getElementById("profileBtn")
      .addEventListener("click", () => this.openProfile());

    // Floating Add Button
    document
      .getElementById("floatingAdd")
      .addEventListener("click", () => this.focusAIInput());

    // Alert Dismissal
    const dismissBtn = document.getElementById("dismissAlert");
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => this.dismissAlert());
    }

    // Insights Refresh
    document
      .getElementById("refreshInsights")
      .addEventListener("click", () => this.updateInsights());

    // Export Data
    document
      .getElementById("exportBtn")
      .addEventListener("click", () => this.exportData());

    // Load More
    document
      .getElementById("loadMoreBtn")
      .addEventListener("click", () => this.loadMoreExpenses());
  }

  async processAIInput() {
    const input = document.getElementById("aiInput").value.trim();
    if (!input) return;

    this.showLoading(true);
    this.updateAIStatus("Processing...");

    try {
      const expense = await this.parseExpenseWithAI(input);
      if (expense) {
        this.addExpense(expense);
        this.showNotification(
          `Added expense: $${expense.amount} for ${expense.description}`
        );
        document.getElementById("aiInput").value = "";
        this.updateAIStatus("Ready");
        this.updateSuggestions(expense);
      }
    } catch (error) {
      console.error("AI processing error:", error);
      this.updateAIStatus("Error - Try again");
    } finally {
      this.showLoading(false);
    }
  }

  async parseExpenseWithAI(input) {
    // Simulate AI processing with realistic parsing
    await this.delay(1500); // Simulate API call

    // Enhanced regex patterns for parsing
    const patterns = {
      amount: /\$?(\d+(?:\.\d{2})?)/,
      categories: {
        coffee: /(coffee|starbucks|latte|espresso|cappuccino|café)/i,
        food: /(food|lunch|dinner|breakfast|restaurant|meal|eat|pizza|burger)/i,
        transport: /(uber|lyft|taxi|bus|train|gas|fuel|transport|parking)/i,
        shopping:
          /(shop|store|buy|purchase|amazon|target|mall|clothes|shopping)/i,
        entertainment:
          /(movie|cinema|game|concert|show|entertainment|theater)/i,
        bills: /(bill|electric|water|internet|phone|rent|utilities)/i,
        health: /(doctor|medicine|pharmacy|hospital|health|medical)/i,
        groceries: /(grocery|groceries|supermarket|walmart|costco|market)/i,
      },
      moods: {
        happy: /(happy|excited|great|awesome|amazing|love|wonderful)/i,
        neutral: /(okay|fine|normal|usual|regular)/i,
        stressed: /(stressed|worried|anxious|frustrated|upset|angry|bad)/i,
      },
      locations:
        /(at|in|near|downtown|mall|store|restaurant|home|work|airport)/i,
    };

    // Extract amount
    const amountMatch = input.match(patterns.amount);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

    if (amount === 0) {
      throw new Error("Could not detect expense amount");
    }

    // Extract category
    let category = "other";
    for (const [cat, pattern] of Object.entries(patterns.categories)) {
      if (pattern.test(input)) {
        category = cat;
        break;
      }
    }

    // Extract mood
    let mood = "neutral";
    for (const [moodType, pattern] of Object.entries(patterns.moods)) {
      if (pattern.test(input)) {
        mood = moodType;
        break;
      }
    }

    // Extract location context
    const locationMatch = input.match(patterns.locations);
    const locationContext = locationMatch ? locationMatch[0] : null;

    // Generate description
    const description = this.generateDescription(input, category);

    return {
      id: Date.now(),
      amount,
      description,
      category,
      mood,
      location: locationContext,
      coordinates: this.currentLocation,
      timestamp: new Date(),
      originalInput: input,
      aiProcessed: true,
    };
  }

  generateDescription(input, category) {
    // Remove amount and common words to create cleaner description
    let description = input
      .replace(/\$?\d+(?:\.\d{2})?/, "")
      .replace(/(just|spent|on|at|in|for|the|a|an)/gi, "")
      .trim();

    if (description.length < 3) {
      const categoryDescriptions = {
        coffee: "Coffee purchase",
        food: "Food & dining",
        transport: "Transportation",
        shopping: "Shopping",
        entertainment: "Entertainment",
        bills: "Bill payment",
        health: "Health & medical",
        groceries: "Groceries",
      };
      description = categoryDescriptions[category] || "General expense";
    }

    return description.charAt(0).toUpperCase() + description.slice(1);
  }

  addExpense(expense) {
    this.expenses.unshift(expense);
    this.saveToStorage("expenses", this.expenses);
    this.updateDashboard();
    this.renderExpenses();
    this.updateChart();
    this.updateTree();
    this.updateInsights();
  }

  updateDashboard() {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    // Calculate totals
    const totalSpent = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const todaySpent = this.expenses
      .filter(
        (exp) => new Date(exp.timestamp).toDateString() === today.toDateString()
      )
      .reduce((sum, exp) => sum + exp.amount, 0);

    const monthlyExpenses = this.expenses.filter((exp) => {
      const expDate = new Date(exp.timestamp);
      return (
        expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear
      );
    });

    const monthlySpent = monthlyExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );
    const avgDaily = monthlySpent / new Date().getDate();
    const budgetLeft = this.settings.monthlyBudget - monthlySpent;
    const budgetUsedPercent = Math.round(
      (monthlySpent / this.settings.monthlyBudget) * 100
    );

    // Update DOM
    document.getElementById("totalSpent").textContent =
      this.formatCurrency(totalSpent);
    document.getElementById("todaySpent").textContent =
      this.formatCurrency(todaySpent);
    document.getElementById("avgDaily").textContent =
      this.formatCurrency(avgDaily);
    document.getElementById("budgetLeft").textContent =
      this.formatCurrency(budgetLeft);
    document.getElementById(
      "budgetProgress"
    ).textContent = `${budgetUsedPercent}% used`;
  }

  renderExpenses() {
    const container = document.getElementById("expenseList");
    const searchTerm = document
      .getElementById("searchExpenses")
      .value.toLowerCase();
    const categoryFilter = document.getElementById("filterCategory").value;

    let filteredExpenses = this.expenses.filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchTerm) ||
        expense.category.toLowerCase().includes(searchTerm);
      const matchesCategory =
        !categoryFilter || expense.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    const expensesToShow = filteredExpenses.slice(
      0,
      this.displayedExpensesCount
    );

    container.innerHTML = expensesToShow
      .map(
        (expense) => `
            <div class="expense-item">
                <div class="expense-details">
                    <div class="mood-indicator mood-${expense.mood}"></div>
                    <div class="expense-main">
                        <div class="expense-title">${expense.description}</div>
                        <div class="expense-meta">
                            <span class="expense-category">${this.formatCategory(
                              expense.category
                            )}</span>
                            <span>${this.formatDate(expense.timestamp)}</span>
                            ${
                              expense.location
                                ? `<span>📍 ${expense.location}</span>`
                                : ""
                            }
                        </div>
                    </div>
                </div>
                <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            </div>
        `
      )
      .join("");

    // Show/hide load more button
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
      loadMoreBtn.style.display =
        filteredExpenses.length > this.displayedExpensesCount
          ? "block"
          : "none";
    }
  }

  updateChart() {
    const canvas = document.getElementById("spendingChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Get period data
    const period = document.querySelector(".chart-period.active").dataset
      .period;
    const periodData = this.getPeriodData(period);

    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    this.chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(periodData),
        datasets: [
          {
            data: Object.values(periodData),
            backgroundColor: [
              "#667eea",
              "#764ba2",
              "#f093fb",
              "#f5576c",
              "#4facfe",
              "#00f2fe",
              "#43e97b",
              "#38f9d7",
              "#ffecd2",
              "#fcb69f",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        cutout: "60%",
      },
    });

    // Update legend
    this.updateChartLegend(periodData);
  }

  getPeriodData(period) {
    const now = new Date();
    let startDate;

    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const periodExpenses = this.expenses.filter(
      (exp) => new Date(exp.timestamp) >= startDate
    );

    const categoryTotals = {};
    periodExpenses.forEach((exp) => {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + exp.amount;
    });

    return categoryTotals;
  }

  updateChartLegend(data) {
    const legend = document.getElementById("chartLegend");
    if (!legend) return;

    const total = Object.values(data).reduce((sum, val) => sum + val, 0);

    legend.innerHTML = Object.entries(data)
      .map(([category, amount], index) => {
        const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
        const color = this.chart.data.datasets[0].backgroundColor[index];

        return `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%;"></div>
                    <span>${this.formatCategory(
                      category
                    )}: ${percentage}%</span>
                </div>
            `;
      })
      .join("");
  }

  updateTree() {
    const monthlySpent = this.getMonthlySpent();
    const savingsRate = Math.max(
      0,
      (this.settings.monthlyBudget - monthlySpent) / this.settings.monthlyBudget
    );
    const treeHealth = Math.round(savingsRate * 100);

    // Calculate growth level (1-10 based on consistent saving)
    const growthLevel = Math.min(10, Math.floor(treeHealth / 10) + 1);

    // Calculate savings streak
    const savingsStreak = this.calculateSavingsStreak();

    // Update tree emoji based on health
    const treeEmojis = ["🌱", "🌿", "🌳", "🌲"];
    const emojiIndex = Math.min(
      treeEmojis.length - 1,
      Math.floor(treeHealth / 25)
    );

    // Update DOM
    document.getElementById("treeHealth").textContent = `${treeHealth}%`;
    document.getElementById("treeEmoji").textContent = treeEmojis[emojiIndex];
    document.getElementById("growthLevel").textContent = growthLevel;
    document.getElementById(
      "savingsStreak"
    ).textContent = `${savingsStreak} days`;
    document.getElementById("treeProgress").style.width = `${treeHealth}%`;

    // Add leaves animation based on health
    this.animateTreeLeaves(treeHealth);
  }

  animateTreeLeaves(health) {
    const leavesContainer = document.getElementById("treeLeaves");
    if (health > 70) {
      leavesContainer.textContent = "✨🍃✨";
    } else if (health > 40) {
      leavesContainer.textContent = "🍃";
    } else {
      leavesContainer.textContent = "";
    }
  }

  calculateSavingsStreak() {
    // Simple calculation - days since last "over budget" day
    const dailyBudget = this.settings.monthlyBudget / 30;
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const daySpent = this.expenses
        .filter(
          (exp) =>
            new Date(exp.timestamp).toDateString() === checkDate.toDateString()
        )
        .reduce((sum, exp) => sum + exp.amount, 0);

      if (daySpent <= dailyBudget) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  updateInsights() {
    const insights = this.generateInsights();
    const container = document.getElementById("insightsContent");

    container.innerHTML = insights
      .map(
        (insight) => `
            <div class="insight-item">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-text">
                    <strong>${insight.title}:</strong> ${insight.description}
                </div>
            </div>
        `
      )
      .join("");
  }

  generateInsights() {
    const insights = [];

    // Spending trend
    const thisWeekSpent = this.getWeeklySpent(0);
    const lastWeekSpent = this.getWeeklySpent(1);
    const trendPercent =
      lastWeekSpent > 0
        ? (((thisWeekSpent - lastWeekSpent) / lastWeekSpent) * 100).toFixed(0)
        : 0;

    insights.push({
      icon: trendPercent < 0 ? "📈" : "📉",
      title: "Spending Trend",
      description:
        trendPercent < 0
          ? `You're spending ${Math.abs(
              trendPercent
            )}% less this week. Great progress!`
          : `Spending up ${trendPercent}% from last week. Consider reviewing your budget.`,
    });

    // Peak spending time
    const hourCounts = {};
    this.expenses.forEach((exp) => {
      const hour = new Date(exp.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHour = Object.keys(hourCounts).reduce(
      (a, b) => (hourCounts[a] > hourCounts[b] ? a : b),
      "12"
    );
    insights.push({
      icon: "⏰",
      title: "Peak Spending Time",
      description: `Most expenses occur around ${peakHour}:00. Plan purchases mindfully during this time.`,
    });

    // Category insight
    const categoryTotals = this.getPeriodData("month");
    const topCategory = Object.keys(categoryTotals).reduce(
      (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
      "food"
    );
    const topCategoryAmount = categoryTotals[topCategory] || 0;

    insights.push({
      icon: "📊",
      title: "Top Category",
      description: `${this.formatCategory(
        topCategory
      )} is your biggest expense this month at $${topCategoryAmount.toFixed(
        2
      )}.`,
    });

    return insights;
  }

  // Utility functions
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: this.settings.currency,
    }).format(amount);
  }

  formatCategory(category) {
    const categoryMap = {
      coffee: "☕ Coffee",
      food: "🍽️ Food",
      transport: "🚗 Transport",
      shopping: "🛍️ Shopping",
      entertainment: "🎬 Entertainment",
      bills: "📋 Bills",
      health: "🏥 Health",
      groceries: "🛒 Groceries",
      other: "📝 Other",
    };
    return categoryMap[category] || "📝 Other";
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  }

  getMonthlySpent() {
    const now = new Date();
    return this.expenses
      .filter((exp) => {
        const expDate = new Date(exp.timestamp);
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }

  getWeeklySpent(weeksAgo = 0) {
    const now = new Date();
    const startOfWeek = new Date(
      now.getTime() - (weeksAgo * 7 + now.getDay()) * 24 * 60 * 60 * 1000
    );
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

    return this.expenses
      .filter((exp) => {
        const expDate = new Date(exp.timestamp);
        return expDate >= startOfWeek && expDate < endOfWeek;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }

  // Event handlers
  async startVoiceInput() {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Voice input not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    this.updateAIStatus("Listening...");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById("aiInput").value = transcript;
      this.updateAIStatus("Ready");
    };

    recognition.onerror = () => {
      this.updateAIStatus("Voice error - Try again");
    };

    recognition.start();
  }

  scanReceipt() {
    // Create file input for receipt scanning
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        this.processReceiptImage(file);
      }
    };
    input.click();
  }

  async processReceiptImage(file) {
    this.showLoading(true);
    this.updateAIStatus("Scanning receipt...");

    try {
      // Simulate receipt processing
      await this.delay(2000);

      // Mock receipt data
      const mockReceiptData = {
        amount: 15.99,
        description: "Grocery shopping",
        category: "groceries",
        merchant: "Local Market",
      };

      const expense = {
        id: Date.now(),
        ...mockReceiptData,
        mood: "neutral",
        timestamp: new Date(),
        aiProcessed: true,
        receiptScanned: true,
      };

      this.addExpense(expense);
      this.showNotification(
        `Receipt processed: $${expense.amount} for ${expense.description}`
      );
      this.updateAIStatus("Ready");
    } catch (error) {
      console.error("Receipt processing error:", error);
      this.updateAIStatus("Scan failed - Try again");
    } finally {
      this.showLoading(false);
    }
  }

  quickAdd(category) {
    const amounts = {
      coffee: 5.99,
      food: 12.99,
      gas: 35.0,
      shopping: 25.99,
    };

    const expense = {
      id: Date.now(),
      amount: amounts[category] || 10.0,
      description: `Quick ${
        this.formatCategory(category).split(" ")[1]
      } expense`,
      category,
      mood: "neutral",
      timestamp: new Date(),
      aiProcessed: false,
    };

    this.addExpense(expense);
    this.showNotification(`Added quick expense: $${expense.amount}`);
  }

  changePeriod(period) {
    document
      .querySelectorAll(".chart-period")
      .forEach((btn) => btn.classList.remove("active"));
    document.querySelector(`[data-period="${period}"]`).classList.add("active");
    this.updateChart();
  }

  filterExpenses() {
    this.displayedExpensesCount = 10;
    this.renderExpenses();
  }

  loadMoreExpenses() {
    this.displayedExpensesCount += 10;
    this.renderExpenses();
  }

  focusAIInput() {
    document.getElementById("aiInput").focus();
  }

  dismissAlert() {
    const alert = document.getElementById("locationAlert");
    if (alert) {
      alert.style.display = "none";
    }
  }

  openSettings() {
    alert("Settings panel - Coming soon!");
  }

  openProfile() {
    alert("Profile panel - Coming soon!");
  }

  exportData() {
    const data = {
      expenses: this.expenses,
      goals: this.goals,
      settings: this.settings,
      exportDate: new Date(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // UI helpers
  updateAIStatus(status) {
    document.getElementById("aiStatus").textContent = status;
  }

  showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.style.display = show ? "flex" : "none";
    }
  }

  updateSuggestions(expense) {
    const suggestions = document.getElementById("aiSuggestions");
    if (suggestions) {
      suggestions.innerHTML = `
                <div class="suggestion-item">
                    <strong>💡 AI Insight:</strong> Based on your recent ${
                      expense.category
                    } purchases, you've spent $${this.getCategoryTotal(
        expense.category
      ).toFixed(2)} this month. Consider setting a weekly ${
        expense.category
      } budget!
                </div>
            `;
    }
  }

  getCategoryTotal(category) {
    const now = new Date();
    return this.expenses
      .filter((exp) => {
        const expDate = new Date(exp.timestamp);
        return (
          exp.category === category &&
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }

  showNotification(message) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("💰 ControlSpending", {
        body: message,
        icon: "/favicon.ico",
      });
    }
  }

  // Geolocation and service worker setup
  setupGeolocation() {
    if (this.settings.locationTracking && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        },
        (error) => console.log("Geolocation error:", error)
      );
    }
  }

  requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  setupServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => console.log("SW registered"))
        .catch((error) => console.log("SW registration failed:", error));
    }
  }

  // Advanced AI Features
  async generatePredictiveInsights() {
    const insights = [];

    // Analyze spending velocity
    const recentExpenses = this.expenses.slice(0, 10);
    const averageAmount =
      recentExpenses.reduce((sum, exp) => sum + exp.amount, 0) /
      recentExpenses.length;

    if (averageAmount > 0) {
      const projectedMonthly = averageAmount * 30;
      const budgetRisk =
        projectedMonthly > this.settings.monthlyBudget ? "high" : "low";

      insights.push({
        type: "prediction",
        icon: budgetRisk === "high" ? "⚠️" : "✅",
        title: "Monthly Projection",
        description: `Based on recent patterns, you're projected to spend $${projectedMonthly.toFixed(
          2
        )} this month`,
        priority: budgetRisk === "high" ? "high" : "medium",
      });
    }

    // Mood-based spending analysis
    const moodSpending = this.analyzeMoodSpending();
    if (moodSpending.riskMood) {
      insights.push({
        type: "behavioral",
        icon: "🧠",
        title: "Mood Pattern Alert",
        description: `You spend ${moodSpending.percentage}% more when feeling ${moodSpending.riskMood}`,
        priority: "medium",
      });
    }

    // Day-of-week patterns
    const dayPattern = this.analyzeDayPatterns();
    if (dayPattern.peakDay) {
      insights.push({
        type: "temporal",
        icon: "📅",
        title: "Weekly Pattern",
        description: `${
          dayPattern.peakDay
        }s are your highest spending days (avg: $${dayPattern.avgAmount.toFixed(
          2
        )})`,
        priority: "low",
      });
    }

    return insights;
  }

  analyzeMoodSpending() {
    const moodTotals = {};
    const moodCounts = {};

    this.expenses.forEach((exp) => {
      if (exp.mood) {
        moodTotals[exp.mood] = (moodTotals[exp.mood] || 0) + exp.amount;
        moodCounts[exp.mood] = (moodCounts[exp.mood] || 0) + 1;
      }
    });

    const moodAverages = {};
    Object.keys(moodTotals).forEach((mood) => {
      moodAverages[mood] = moodTotals[mood] / moodCounts[mood];
    });

    // Find the mood with highest average spending
    const sortedMoods = Object.entries(moodAverages).sort(
      (a, b) => b[1] - a[1]
    );
    const neutralAvg = moodAverages.neutral || 0;

    if (sortedMoods.length > 0 && sortedMoods[0][1] > neutralAvg * 1.2) {
      const percentage = Math.round(
        ((sortedMoods[0][1] - neutralAvg) / neutralAvg) * 100
      );
      return {
        riskMood: sortedMoods[0][0],
        percentage,
        avgAmount: sortedMoods[0][1],
      };
    }

    return {};
  }

  analyzeDayPatterns() {
    const dayTotals = {};
    const dayCounts = {};
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    this.expenses.forEach((exp) => {
      const dayIndex = new Date(exp.timestamp).getDay();
      const dayName = days[dayIndex];
      dayTotals[dayName] = (dayTotals[dayName] || 0) + exp.amount;
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    });

    const dayAverages = {};
    Object.keys(dayTotals).forEach((day) => {
      dayAverages[day] = dayTotals[day] / (dayCounts[day] || 1);
    });

    const sortedDays = Object.entries(dayAverages).sort((a, b) => b[1] - a[1]);

    if (sortedDays.length > 0) {
      return {
        peakDay: sortedDays[0][0],
        avgAmount: sortedDays[0][1],
      };
    }

    return {};
  }

  // Enhanced Location Features
  setupAdvancedGeolocation() {
    if (!this.settings.locationTracking || !("geolocation" in navigator)) {
      return;
    }

    // Define high-spending zones
    this.spendingZones = [
      {
        name: "Downtown Shopping District",
        center: { lat: 40.7589, lng: -73.9851 }, // Example coordinates
        radius: 500, // meters
        avgSpending: 85,
        category: "shopping",
      },
      {
        name: "Restaurant Row",
        center: { lat: 40.7614, lng: -73.9776 },
        radius: 300,
        avgSpending: 45,
        category: "food",
      },
    ];

    // Start watching position
    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handleLocationUpdate(position),
      (error) => console.log("Geolocation error:", error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  handleLocationUpdate(position) {
    this.currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    // Check if user is in a high-spending zone
    const nearbyZone = this.findNearbySpendingZone(this.currentLocation);
    if (nearbyZone && !this.hasShownZoneAlert(nearbyZone.name)) {
      this.showLocationAlert(nearbyZone);
      this.markZoneAlertShown(nearbyZone.name);
    }
  }

  findNearbySpendingZone(location) {
    return this.spendingZones.find((zone) => {
      const distance = this.calculateDistance(location, zone.center);
      return distance <= zone.radius;
    });
  }

  calculateDistance(point1, point2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  hasShownZoneAlert(zoneName) {
    const alertKey = `zoneAlert_${zoneName}_${new Date().toDateString()}`;
    return this.loadFromStorage(alertKey) || false;
  }

  markZoneAlertShown(zoneName) {
    const alertKey = `zoneAlert_${zoneName}_${new Date().toDateString()}`;
    this.saveToStorage(alertKey, true);
  }

  showLocationAlert(zone) {
    const alert = document.getElementById("locationAlert");
    if (alert) {
      const alertText = alert.querySelector(".alert-text p");
      if (alertText) {
        alertText.textContent = `You're near ${zone.name}. Average spending here: $${zone.avgSpending}`;
      }
      alert.style.display = "block";

      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (alert.style.display === "block") {
          alert.style.display = "none";
        }
      }, 10000);
    }
  }

  // Enhanced Receipt Processing
  async processReceiptImageAdvanced(file) {
    this.showLoading(true);
    this.updateAIStatus("Analyzing receipt...");

    try {
      // Create canvas for image processing
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      return new Promise((resolve, reject) => {
        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Simulate advanced OCR processing
          await this.delay(3000);

          // Mock sophisticated receipt parsing
          const mockResults = this.generateMockReceiptData();

          if (mockResults.items && mockResults.items.length > 0) {
            // Process multiple items if found
            mockResults.items.forEach((item) => {
              const expense = {
                id: Date.now() + Math.random(),
                amount: item.amount,
                description: item.description,
                category: this.categorizeMerchant(mockResults.merchant),
                merchant: mockResults.merchant,
                mood: "neutral",
                timestamp: new Date(),
                aiProcessed: true,
                receiptScanned: true,
                receiptData: mockResults,
              };
              this.addExpense(expense);
            });

            this.showNotification(
              `Processed ${mockResults.items.length} items from receipt`
            );
          } else {
            // Single expense
            const expense = {
              id: Date.now(),
              amount: mockResults.total,
              description: `Purchase at ${mockResults.merchant}`,
              category: this.categorizeMerchant(mockResults.merchant),
              merchant: mockResults.merchant,
              mood: "neutral",
              timestamp: new Date(),
              aiProcessed: true,
              receiptScanned: true,
              receiptData: mockResults,
            };
            this.addExpense(expense);
            this.showNotification(`Receipt processed: $${expense.amount}`);
          }

          resolve(mockResults);
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error("Advanced receipt processing error:", error);
      this.updateAIStatus("Receipt scan failed");
      throw error;
    } finally {
      this.showLoading(false);
      this.updateAIStatus("Ready");
    }
  }

  generateMockReceiptData() {
    const merchants = [
      { name: "Target", category: "shopping" },
      { name: "Starbucks", category: "coffee" },
      { name: "Whole Foods Market", category: "groceries" },
      { name: "Shell Gas Station", category: "transport" },
      { name: "Amazon Fresh", category: "groceries" },
    ];

    const selectedMerchant =
      merchants[Math.floor(Math.random() * merchants.length)];

    return {
      merchant: selectedMerchant.name,
      total: parseFloat((Math.random() * 50 + 10).toFixed(2)),
      date: new Date(),
      items: [
        {
          description: "Item 1",
          amount: parseFloat((Math.random() * 20 + 5).toFixed(2)),
        },
        {
          description: "Item 2",
          amount: parseFloat((Math.random() * 15 + 3).toFixed(2)),
        },
      ],
      paymentMethod: "Credit Card",
      confidence: 0.85,
    };
  }

  categorizeMerchant(merchantName) {
    const merchantCategories = {
      starbucks: "coffee",
      target: "shopping",
      walmart: "groceries",
      "whole foods": "groceries",
      shell: "transport",
      exxon: "transport",
      amazon: "shopping",
      mcdonalds: "food",
      subway: "food",
    };

    const lowerMerchant = merchantName.toLowerCase();
    for (const [key, category] of Object.entries(merchantCategories)) {
      if (lowerMerchant.includes(key)) {
        return category;
      }
    }

    return "other";
  }

  // Enhanced Insights with Machine Learning-style Analysis
  async generateAdvancedInsights() {
    const insights = [];

    // Spending pattern recognition
    const patterns = this.detectSpendingPatterns();
    if (patterns.length > 0) {
      insights.push(...patterns);
    }

    // Budget optimization suggestions
    const budgetSuggestions = this.generateBudgetOptimizations();
    if (budgetSuggestions.length > 0) {
      insights.push(...budgetSuggestions);
    }

    // Anomaly detection
    const anomalies = this.detectSpendingAnomalies();
    if (anomalies.length > 0) {
      insights.push(...anomalies);
    }

    return insights;
  }

  detectSpendingPatterns() {
    const patterns = [];
    const recentExpenses = this.expenses.slice(0, 30); // Last 30 expenses

    // Pattern: Recurring expenses
    const merchantCounts = {};
    recentExpenses.forEach((exp) => {
      if (exp.merchant) {
        merchantCounts[exp.merchant] = (merchantCounts[exp.merchant] || 0) + 1;
      }
    });

    Object.entries(merchantCounts).forEach(([merchant, count]) => {
      if (count >= 3) {
        const avgAmount =
          recentExpenses
            .filter((exp) => exp.merchant === merchant)
            .reduce((sum, exp) => sum + exp.amount, 0) / count;

        patterns.push({
          type: "pattern",
          icon: "🔄",
          title: "Recurring Pattern",
          description: `You visit ${merchant} frequently (${count} times) - avg $${avgAmount.toFixed(
            2
          )}`,
          priority: "medium",
        });
      }
    });

    // Pattern: Time-based clustering
    const hourlySpending = {};
    recentExpenses.forEach((exp) => {
      const hour = new Date(exp.timestamp).getHours();
      hourlySpending[hour] = (hourlySpending[hour] || 0) + exp.amount;
    });

    const peakHour = Object.entries(hourlySpending).sort(
      (a, b) => b[1] - a[1]
    )[0];

    if (peakHour && peakHour[1] > 0) {
      patterns.push({
        type: "temporal",
        icon: "⏰",
        title: "Peak Spending Hour",
        description: `You spend most around ${
          peakHour[0]
        }:00 ($${peakHour[1].toFixed(2)} total)`,
        priority: "low",
      });
    }

    return patterns;
  }

  generateBudgetOptimizations() {
    const optimizations = [];
    const monthlyByCategory = this.getPeriodData("month");

    // Find categories where small reductions could have big impact
    Object.entries(monthlyByCategory).forEach(([category, amount]) => {
      const dailyAvg = amount / 30;
      const potential20PercentSaving = amount * 0.2;

      if (potential20PercentSaving > 10) {
        // Only suggest if savings > $10
        optimizations.push({
          type: "optimization",
          icon: "💰",
          title: "Savings Opportunity",
          description: `Reduce ${this.formatCategory(
            category
          )} by 20% to save $${potential20PercentSaving.toFixed(2)}/month`,
          priority: "high",
        });
      }
    });

    return optimizations;
  }

  detectSpendingAnomalies() {
    const anomalies = [];
    const recentExpenses = this.expenses.slice(0, 10);

    if (recentExpenses.length < 5) return anomalies;

    // Calculate standard deviation of recent expenses
    const amounts = recentExpenses.map((exp) => exp.amount);
    const mean = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const variance =
      amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) /
      amounts.length;
    const stdDev = Math.sqrt(variance);

    // Find outliers (more than 2 standard deviations from mean)
    recentExpenses.forEach((exp) => {
      if (Math.abs(exp.amount - mean) > 2 * stdDev) {
        anomalies.push({
          type: "anomaly",
          icon: exp.amount > mean ? "📈" : "📉",
          title: "Unusual Spending",
          description: `$${exp.amount.toFixed(2)} for ${exp.description} is ${
            exp.amount > mean ? "much higher" : "much lower"
          } than usual`,
          priority: exp.amount > mean ? "high" : "low",
        });
      }
    });

    return anomalies;
  }

  // Goals and Gamification System
  createGoal(goalData) {
    const goal = {
      id: Date.now(),
      title: goalData.title,
      target: goalData.target,
      current: 0,
      type: goalData.type, // 'savings', 'category', 'total'
      category: goalData.category,
      deadline: goalData.deadline,
      created: new Date(),
      completed: false,
    };

    this.goals.push(goal);
    this.saveToStorage("goals", this.goals);
    this.updateGoalsDisplay();
    this.checkGoalAchievements();

    return goal;
  }

  updateGoalProgress() {
    this.goals.forEach((goal) => {
      if (goal.completed) return;

      switch (goal.type) {
        case "savings":
          const monthlyBudget = this.settings.monthlyBudget;
          const monthlySpent = this.getMonthlySpent();
          goal.current = Math.max(0, monthlyBudget - monthlySpent);
          break;

        case "category":
          const categorySpent = this.getCategoryTotal(goal.category);
          goal.current = Math.max(0, goal.target - categorySpent);
          break;

        case "total":
          goal.current = this.getMonthlySpent();
          break;
      }

      // Check if goal is achieved
      if (goal.current >= goal.target && !goal.completed) {
        goal.completed = true;
        goal.completedDate = new Date();
        this.celebrateGoalAchievement(goal);
      }
    });

    this.saveToStorage("goals", this.goals);
  }

  celebrateGoalAchievement(goal) {
    // Show celebration animation
    this.showGoalCelebration(goal);

    // Award points/badges
    this.awardAchievement(goal);

    // Send notification
    this.showNotification(`🎉 Goal achieved: ${goal.title}!`);
  }

  showGoalCelebration(goal) {
    // Create celebration overlay
    const celebration = document.createElement("div");
    celebration.className = "goal-celebration-overlay";
    celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-emoji">🎉</div>
                <h2>Goal Achieved!</h2>
                <p>${goal.title}</p>
                <div class="celebration-confetti">✨🎊✨</div>
            </div>
        `;

    document.body.appendChild(celebration);

    // Auto-remove after animation
    setTimeout(() => {
      if (celebration.parentNode) {
        celebration.parentNode.removeChild(celebration);
      }
    }, 3000);
  }

  awardAchievement(goal) {
    const achievement = {
      id: Date.now(),
      type: "goal_completed",
      title: `Goal Master: ${goal.title}`,
      description: `Completed goal: ${goal.title}`,
      earnedDate: new Date(),
      points: this.calculateGoalPoints(goal),
    };

    const achievements = this.loadFromStorage("achievements") || [];
    achievements.push(achievement);
    this.saveToStorage("achievements", achievements);
  }

  calculateGoalPoints(goal) {
    const basePoints = 100;
    const typeMultiplier = {
      savings: 2,
      category: 1.5,
      total: 1,
    };

    const timeBonusMultiplier =
      goal.deadline && new Date() < goal.deadline ? 1.5 : 1;

    return Math.round(
      basePoints * (typeMultiplier[goal.type] || 1) * timeBonusMultiplier
    );
  }

  // Social Features
  generateShareableInsight() {
    const monthlySpent = this.getMonthlySpent();
    const budgetUsed = Math.round(
      (monthlySpent / this.settings.monthlyBudget) * 100
    );
    const topCategory = Object.entries(this.getPeriodData("month")).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      text: `This month I've spent $${monthlySpent.toFixed(
        2
      )} (${budgetUsed}% of budget). My top category: ${this.formatCategory(
        topCategory[0]
      )} 📊 #ExpenseTracking #FinancialHealth`,
      data: {
        monthlySpent,
        budgetUsed,
        topCategory: topCategory[0],
        treeHealth: this.calculateTreeHealth(),
      },
    };
  }

  calculateTreeHealth() {
    const monthlySpent = this.getMonthlySpent();
    const savingsRate = Math.max(
      0,
      (this.settings.monthlyBudget - monthlySpent) / this.settings.monthlyBudget
    );
    return Math.round(savingsRate * 100);
  }

  // Data Export and Backup
  exportAdvancedData() {
    const insights = this.generateInsights();
    const goals = this.goals;
    const achievements = this.loadFromStorage("achievements") || [];

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: "2.0",
        totalExpenses: this.expenses.length,
        dateRange: {
          oldest:
            this.expenses.length > 0
              ? new Date(
                  Math.min(...this.expenses.map((e) => new Date(e.timestamp)))
                ).toISOString()
              : null,
          newest:
            this.expenses.length > 0
              ? new Date(
                  Math.max(...this.expenses.map((e) => new Date(e.timestamp)))
                ).toISOString()
              : null,
        },
      },
      expenses: this.expenses,
      goals: goals,
      achievements: achievements,
      settings: this.settings,
      analytics: {
        monthlySpent: this.getMonthlySpent(),
        categoryBreakdown: this.getPeriodData("month"),
        insights: insights,
        treeHealth: this.calculateTreeHealth(),
      },
    };

    return exportData;
  }

  importData(importData) {
    try {
      if (importData.expenses) {
        this.expenses = importData.expenses;
        this.saveToStorage("expenses", this.expenses);
      }

      if (importData.goals) {
        this.goals = importData.goals;
        this.saveToStorage("goals", this.goals);
      }

      if (importData.settings) {
        this.settings = {
          ...this.getDefaultSettings(),
          ...importData.settings,
        };
        this.saveToStorage("settings", this.settings);
      }

      // Refresh all displays
      this.updateDashboard();
      this.renderExpenses();
      this.updateChart();
      this.updateTree();
      this.updateInsights();

      this.showNotification("Data imported successfully!");
    } catch (error) {
      console.error("Import error:", error);
      this.showNotification("Import failed - Invalid data format");
    }
  }

  // Cleanup and Performance
  cleanup() {
    // Stop geolocation watching
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }

    // Clear intervals and timeouts
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Remove event listeners if needed for SPA cleanup
    // (In most cases, this isn't necessary for the current implementation)
  }

  // Performance optimization - lazy loading for large datasets
  optimizePerformance() {
    // If we have too many expenses, archive old ones
    if (this.expenses.length > 1000) {
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

      const recentExpenses = this.expenses.filter(
        (exp) => new Date(exp.timestamp) > cutoffDate
      );

      const archivedExpenses = this.expenses.filter(
        (exp) => new Date(exp.timestamp) <= cutoffDate
      );

      // Save archived expenses separately
      this.saveToStorage("archivedExpenses", archivedExpenses);
      this.expenses = recentExpenses;
      this.saveToStorage("expenses", this.expenses);
    }
  }

  // Initialize performance monitoring
  startPerformanceMonitoring() {
    setInterval(() => {
      this.optimizePerformance();
    }, 300000); // Check every 5 minutes
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize expense tracker
  window.expenseTracker = new ExpenseTracker();

  // Start performance monitoring
  window.expenseTracker.startPerformanceMonitoring();

  // Setup periodic updates
  setInterval(() => {
    window.expenseTracker.updateGoalProgress();
    window.expenseTracker.updateInsights();
  }, 60000); // Update every minute

  console.log(
    "💰 ControlSpending AI Expense Tracker initialized successfully!"
  );
});
