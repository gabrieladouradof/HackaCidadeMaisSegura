// Script para interatividade futura
console.log("Radar Urbano Inteligente - Script carregado.");

let zonasCriticasMap = null; // Global variable to hold the map instance
let dashboardMap = null; // Global variable to hold the dashboard map instance
let occurrencesChart = null; // Chart.js instance for occurrences
let incidentTypesChart = null; // Chart.js instance for incident types
let populationFlowChart = null; // Chart.js instance for population flow
let historicalCrimeChart = null; // Chart.js instance for historical crime
let historicalIncidentTypeChart = null; // Chart.js instance for historical incident types

// Function to initialize the dashboard map
function initDashboardMap() {
    if (dashboardMap) {
        dashboardMap.remove(); // Remove existing map instance to re-initialize
        dashboardMap = null;
    }

    dashboardMap = L.map('dashboard-map').setView([-15.793889, -47.882778], 11);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(dashboardMap);

    // Simulated heatmap data with varying risk levels (green to red)
    const riskAreas = [
        // Low Risk (Green)
        { lat: -15.80, lng: -47.90, radius: 400, color: '#5cb85c', popup: '<b>Plano Piloto:</b> 2 ocorrências leves esta semana. Risco: Baixo' },
        { lat: -15.77, lng: -47.95, radius: 500, color: '#5cb85c', popup: '<b>Lago Norte:</b> 1 incidente de trânsito. Risco: Baixo' },
        { lat: -15.88, lng: -47.98, radius: 600, color: '#5cb85c', popup: '<b>Guará:</b> Baixo índice de criminalidade. Risco: Baixo' },

        // Medium Risk (Orange)
        { lat: -15.83, lng: -48.05, radius: 700, color: '#f0ad4e', popup: '<b>Taguatinga:</b> 8 relatos esta semana. Tipo mais comum: pequenos furtos. Risco: Médio' },
        { lat: -15.85, lng: -47.95, radius: 600, color: '#f0ad4e', popup: '<b>Águas Claras:</b> Aumento de furtos a residências (3 esta semana). Risco: Médio' },
        { lat: -15.68, lng: -47.81, radius: 550, color: '#f0ad4e', popup: '<b>Sobradinho:</b> 5 denúncias de vandalismo e pichações. Risco: Médio' },

        // High Risk (Red)
        { lat: -15.82, lng: -48.08, radius: 900, color: '#d9534f', popup: '<b>Ceilândia Norte:</b> 12 relatos de assaltos nas últimas 72h. Pico de ocorrências entre 19h-22h. Risco: Alto' },
        { lat: -15.89, lng: -48.13, radius: 800, color: '#d9534f', popup: '<b>Samambaia:</b> 9 incidentes de tráfico e aglomerações suspeitas. Risco: Alto' },
        { lat: -15.95, lng: -48.11, radius: 750, color: '#d9534f', popup: '<b>Gama:</b> Crescimento de denúncias de arrombamentos nas madrugadas. Risco: Alto' },
        { lat: -15.75, lng: -47.88, radius: 650, color: '#d9534f', popup: '<b>Asa Sul:</b> Ponto de tráfico em praça específica. Risco: Alto' },
    ];

    riskAreas.forEach(area => {
        L.circle([area.lat, area.lng], {
            color: area.color,
            fillColor: area.color,
            fillOpacity: 0.4,
            radius: area.radius
        }).addTo(dashboardMap).bindPopup(area.popup);
    });

    dashboardMap.invalidateSize(); // Ensure the map renders correctly
}

// Function to update Chart.js charts for Summary Tab
function updateDashboardCharts() {
    // Data for Occurrences by Region (Bar Chart)
    const occurrencesData = {
        labels: ['Ceilândia', 'Taguatinga', 'Gama', 'Plano Piloto', 'Samambaia', 'Guará', 'Sobradinho'],
        datasets: [{
            label: 'Número de Ocorrências',
            data: [250, 180, 120, 80, 150, 60, 90], // Simulated data
            backgroundColor: [
                '#f87171', // Red for Ceilândia
                '#facc15', // Yellow for Taguatinga
                '#f87171', // Red for Gama
                '#4ade80', // Green for Plano Piloto
                '#facc15', // Yellow for Samambaia
                '#4ade80', // Green for Guará
                '#facc15'  // Yellow for Sobradinho
            ],
            borderColor: [
                '#f87171',
                '#facc15',
                '#f87171',
                '#4ade80',
                '#facc15',
                '#4ade80',
                '#facc15'
            ],
            borderWidth: 1
        }]
    };

    const occurrencesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: 'var(--text-color-light)' }, // Changed for contrast
                grid: { color: 'var(--chart-grid-color)' } // Uses variable which is now light
            },
            x: {
                ticks: { color: 'var(--text-color-light)' }, // Changed for contrast
                grid: { color: 'var(--chart-grid-color)' }, // Uses variable which is now light
                barPercentage: 0.7, // Adjust bar spacing
                categoryPercentage: 0.8 // Adjust category spacing
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Ocorrências por Região',
                color: 'var(--text-color-light)' // Changed for contrast
            }
        }
    };

    // Data for Incident Types (Pie Chart)
    const incidentTypesData = {
        labels: ['Furtos e Roubos', 'Vandalismo', 'Iluminação Pública', 'Tráfico de Drogas', 'Ocorrências Urbanas', 'Mobilidade'],
        datasets: [{
            data: [40, 15, 10, 20, 10, 5], // Simulated percentages
            backgroundColor: [
                '#d9534f', // Red
                '#f0ad4e', // Orange
                '#5cb85c', // Green
                '#4175ff', // Primary blue
                '#7bbaff', // Secondary blue
                '#a0a8b1'  // Grey
            ],
            borderColor: 'var(--background-color)',
            borderWidth: 2
        }]
    };

    const incidentTypesOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: 'var(--text-color-light)', // Changed for contrast
                    usePointStyle: true // Use point style for legend items
                }
            },
            title: {
                display: true,
                text: 'Tipos de Incidentes',
                color: 'var(--text-color-light)' // Changed for contrast
            }
        }
    };

    const occurrencesCtx = document.getElementById('occurrencesChart').getContext('2d');
    if (occurrencesChart) {
        occurrencesChart.destroy(); // Destroy old chart instance
    }
    occurrencesChart = new Chart(occurrencesCtx, {
        type: 'bar',
        data: occurrencesData,
        options: occurrencesOptions,
    });

    const incidentTypesCtx = document.getElementById('incidentTypesChart').getContext('2d');
    if (incidentTypesChart) {
        incidentTypesChart.destroy(); // Destroy old chart instance
    }
    incidentTypesChart = new Chart(incidentTypesCtx, {
        type: 'pie',
        data: incidentTypesData,
        options: incidentTypesOptions,
    });
}

// Function to initialize Population Flow Chart
function initPopulationFlowChart() {
    const ctx = document.getElementById('populationFlowChart').getContext('2d');
    if (populationFlowChart) {
        populationFlowChart.destroy();
    }
    populationFlowChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
            datasets: [{
                label: 'Fluxo de Pessoas (Simulado)',
                data: [100, 80, 50, 150, 300, 450, 500, 400, 350, 600, 400, 200],
                borderColor: '#4175ff',
                backgroundColor: 'rgba(65, 117, 255, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Pessoas',
                        color: 'var(--text-color-light)' // Changed for contrast
                    },
                    ticks: { color: 'var(--text-color-light)' }, // Changed for contrast
                    grid: { color: 'var(--chart-grid-color)' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Horário do Dia',
                        color: 'var(--text-color-light)' // Changed for contrast
                    },
                    ticks: { color: 'var(--text-color-light)' }, // Changed for contrast
                    grid: { color: 'var(--chart-grid-color)' }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: { color: 'var(--text-color-light)' } // Changed for contrast
                },
                title: {
                    display: true,
                    text: 'Fluxo Populacional Diário Típico (Área Central)',
                    color: 'var(--text-color-light)' // Changed for contrast
                }
            }
        }
    });
}

// Function to initialize Historical Charts
function initHistoricalCharts() {
    // Simulated data for historical crime (monthly, last year)
    const historicalCrimeData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            label: 'Ocorrências Totais (2023)',
            data: [1200, 1150, 1300, 1250, 1400, 1350, 1280, 1320, 1450, 1500, 1480, 1600],
            borderColor: '#d9534f',
            backgroundColor: 'rgba(217, 83, 79, 0.2)',
            fill: true,
            tension: 0.2
        },
        {
            label: 'Ocorrências Totais (2022)',
            data: [1100, 1050, 1200, 1150, 1300, 1250, 1180, 1220, 1350, 1400, 1380, 1500],
            borderColor: '#f0ad4e',
            backgroundColor: 'rgba(240, 173, 78, 0.2)',
            fill: true,
            tension: 0.2
        }]
    };

    const historicalCrimeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Nº de Ocorrências', color: 'var(--text-color-light)' }, // Changed for contrast
                ticks: { color: 'var(--text-color-light)' }, // Changed for contrast
                grid: { color: 'var(--chart-grid-color)' }
            },
            x: {
                ticks: { color: 'var(--text-color-light)' }, // Changed for contrast
                grid: { color: 'var(--chart-grid-color)' }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'var(--text-color-light)' } // Changed for contrast
            },
            title: {
                display: true,
                text: 'Tendência Anual de Ocorrências',
                color: 'var(--text-color-light)' // Changed for contrast
            }
        }
    };

    // Simulated data for historical incident types (stacked bar)
    const historicalIncidentTypeData = {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [
            {
                label: 'Furtos/Roubos',
                data: [5000, 4800, 5200, 5500, 5800],
                backgroundColor: '#d9534f',
            },
            {
                label: 'Vandalismo',
                data: [1500, 1200, 1400, 1600, 1700],
                backgroundColor: '#f0ad4e',
            },
            {
                label: 'Iluminação Pública',
                data: [1000, 900, 800, 750, 700],
                backgroundColor: '#5cb85c',
            },
            {
                label: 'Tráfico de Drogas',
                data: [800, 900, 1000, 1100, 1200],
                backgroundColor: '#4175ff',
            }
        ]
    };

    const historicalIncidentTypeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                ticks: { color: 'var(--text-color-light)' }, // Changed for contrast
                grid: { color: 'var(--chart-grid-color)' }
            },
            y: {
                stacked: true,
                title: { display: true, text: 'Nº de Incidentes', color: 'var(--text-color-light)' }, // Changed for contrast
                ticks: { color: 'var(--text-color-light)' }, // Changed for contrast
                grid: { color: 'var(--chart-grid-color)' }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'var(--text-color-light)' } // Changed for contrast
            },
            title: {
                display: true,
                text: 'Tipos de Incidentes ao Longo dos Anos',
                color: 'var(--text-color-light)' // Changed for contrast
            }
        }
    };

    const historicalCrimeCtx = document.getElementById('historicalCrimeChart').getContext('2d');
    if (historicalCrimeChart) {
        historicalCrimeChart.destroy();
    }
    historicalCrimeChart = new Chart(historicalCrimeCtx, {
        type: 'line',
        data: historicalCrimeData,
        options: historicalCrimeOptions,
    });

    const historicalIncidentTypeCtx = document.getElementById('historicalIncidentTypeChart').getContext('2d');
    if (historicalIncidentTypeChart) {
        historicalIncidentTypeChart.destroy();
    }
    historicalIncidentTypeChart = new Chart(historicalIncidentTypeCtx, {
        type: 'bar',
        data: historicalIncidentTypeData,
        options: historicalIncidentTypeOptions,
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('main section');
    const navLi = document.querySelectorAll('.main-nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Adjust offset for sticky header height
            if (pageYOffset >= sectionTop - 150) { 
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            // Remove active style from all
            a.style.fontWeight = '400';
            a.classList.remove('active'); // Use a class for better styling

            // Add active style to the current section's link
            if (a.getAttribute('href') === `#${current}`) {
                a.style.fontWeight = '600';
                a.classList.add('active'); // Add a class for better styling
            }
        });
    });

    // Helper function to handle opening/closing overlays
    function openOverlay(overlayElement) {
        overlayElement.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling of the background

        // Add click-outside-to-close functionality
        overlayElement.addEventListener('click', function handler(event) {
            if (event.target === overlayElement) {
                closeOverlay(overlayElement);
                overlayElement.removeEventListener('click', handler); // Remove listener to prevent memory leaks
            }
        });
    }

    function closeOverlay(overlayElement) {
        overlayElement.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Handle Bot Cidadão card click to show overlay
    const botCidadaoCard = document.getElementById('bot-cidadao-card');
    const botDetailsOverlay = document.getElementById('bot-details-overlay');
    const closeButtonBot = document.querySelector('#bot-details-overlay .close-button');
    
    // NEW: Bot Cidadão Specific Elements
    const chatTextarea = document.getElementById('chat-textarea');
    const audioSendButton = document.getElementById('audio-send-button');
    const textSendButton = document.getElementById('text-send-button');
    const predefinedTopicItems = document.querySelectorAll('.predefined-topics-section li');
    const predefinedTopicsDetails = document.querySelector('.predefined-topics-section details');
    const locationInput = document.getElementById('location-input'); // Get reference to new location input

    const messageConfirmationOverlay = document.getElementById('message-confirmation-overlay');
    const confirmationCloseButton = document.querySelector('#message-confirmation-overlay .close-button');
    const confirmationOkButton = document.querySelector('.confirmation-ok-button');
    const sentMessageDisplay = document.querySelector('.sent-message-display');

    let selectedReportType = ''; // Variable to store the selected report type
    const currentSelectedTypeSpan = document.getElementById('current-selected-type');
    const selectedReportTypeDisplay = document.querySelector('.selected-report-type-display');

    let prefilledOnce = false; // Flag to track if fields have been pre-filled

    // Store original text content for predefined topic items
    predefinedTopicItems.forEach(item => {
        item.dataset.originalText = item.textContent;
    });

    if (botCidadaoCard && botDetailsOverlay && closeButtonBot) {
        botCidadaoCard.style.cursor = 'pointer'; // Indicate it's clickable
        botCidadaoCard.addEventListener('click', () => {
            openOverlay(botDetailsOverlay);
            // Reset the selection and textarea when opening
            resetBotInteractionForm();
        });

        closeButtonBot.addEventListener('click', () => {
            closeOverlay(botDetailsOverlay);
            resetBotInteractionForm(); // Ensure reset on close
        });

        // Modified: Predefined Topics Click Handler
        predefinedTopicItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove 'selected' class from all items first
                predefinedTopicItems.forEach(li => {
                    li.classList.remove('selected');
                    li.innerHTML = li.dataset.originalText; // Restore original text
                });

                const reportType = item.dataset.report || item.dataset.originalText; // Use original text as fallback
                selectedReportType = reportType; // Store the selected type
                item.classList.add('selected'); // Add 'selected' class to the clicked item
                item.innerHTML = `✅ ${item.dataset.originalText}`; // Add checkmark

                currentSelectedTypeSpan.textContent = selectedReportType;
                selectedReportTypeDisplay.style.display = 'flex'; // Show the display area (changed to flex)

                if (predefinedTopicsDetails) {
                    predefinedTopicsDetails.open = false; // Collapse the details section
                }
            });
        });

        // Modified: Enviar Texto Button Handler
        textSendButton.addEventListener('click', () => {
            const message = chatTextarea.value.trim();
            const location = locationInput.value.trim();
            let combinedMessage = "";

            // First click behavior: pre-fill fields
            if (!prefilledOnce && message === '' && location === '') {
                chatTextarea.value = "Aqui no bairro o comércio já tá sentindo falta de clientes. A galera evita sair à noite porque tá tudo apagado, não dá nem vontade de passar pelas ruas.";
                locationInput.value = "QNM 28, Lote 15, Padaria Pão Nosso, em Ceilândia Sul";
                prefilledOnce = true;
                textSendButton.textContent = '📩 Enviar Agora'; // Change button text for feedback
                
                // If no topic is selected, simulate click on "Iluminação pública"
                if (!selectedReportType) {
                    const ilumPublicaItem = Array.from(predefinedTopicItems).find(item => item.dataset.report === 'Iluminação pública');
                    if (ilumPublicaItem) {
                        ilumPublicaItem.click(); // Programmatically click it to set selection
                    } else {
                        // Fallback if "Iluminação pública" is not found, just display "Outros"
                        selectedReportType = 'Iluminação pública'; // Set the type directly
                        currentSelectedTypeSpan.textContent = selectedReportType;
                        selectedReportTypeDisplay.style.display = 'flex';
                    }
                }
                return; // Stop here, don't send on first click
            }

            // Second click (or if fields were already filled manually)
            if (selectedReportType) {
                combinedMessage += `<strong>Tipo de denúncia:</strong> ${selectedReportType}<br>`; // Use <br> for HTML display
            } else {
                combinedMessage += `<strong>Tipo de denúncia:</strong> Não especificado (ou Outros)<br>`;
            }

            if (location) {
                combinedMessage += `<strong>Localização:</strong> ${location}<br>`;
            } else {
                combinedMessage += `<strong>Localização:</strong> Não informada<br>`;
            }

            if (message) {
                combinedMessage += `<strong>Relato:</strong> "${message}"`;
            } else {
                combinedMessage += `<strong>Relato:</strong> (Nenhum texto fornecido)`;
            }

            // Only send if at least one field (type, location, or message) has content
            if (selectedReportType || location || message) {
                closeOverlay(botDetailsOverlay); // Hide bot overlay
                sentMessageDisplay.innerHTML = combinedMessage; // Display the combined message
                openOverlay(messageConfirmationOverlay);
                
                resetBotInteractionForm(); // Clear fields and reset flag after sending
            } else {
                alert('Por favor, selecione um tipo de denúncia, informe a localização ou digite seu relato antes de enviar.');
            }
        });

        // Modified: Enviar Áudio Button Handler (clear fields)
        audioSendButton.addEventListener('click', () => {
            if (audioSendButton.classList.contains('recording')) {
                return;
            }

            audioSendButton.textContent = 'Gravando...';
            audioSendButton.classList.add('recording');
            audioSendButton.style.pointerEvents = 'none';

            setTimeout(() => {
                audioSendButton.textContent = '🎤 Enviar Áudio';
                audioSendButton.classList.remove('recording');
                audioSendButton.style.pointerEvents = '';

                closeOverlay(botDetailsOverlay);
                sentMessageDisplay.innerHTML = `<strong>Mensagem:</strong> Mensagem de áudio recebida.`; // Generic audio message
                openOverlay(messageConfirmationOverlay);

                resetBotInteractionForm(); // Clear fields after sending (audio)
            }, 3000);
        });

        // Message Confirmation Overlay Close Handlers
        if (confirmationCloseButton) {
            confirmationCloseButton.addEventListener('click', () => {
                closeOverlay(messageConfirmationOverlay);
            });
        }
        if (confirmationOkButton) {
            confirmationOkButton.addEventListener('click', () => {
                closeOverlay(messageConfirmationOverlay);
            });
        }

        // Function to reset the bot interaction form state
        function resetBotInteractionForm() {
            chatTextarea.value = '';
            locationInput.value = ''; // Clear location input
            selectedReportType = ''; // Clear selected type
            currentSelectedTypeSpan.textContent = 'Nenhum';
            selectedReportTypeDisplay.style.display = 'none'; // Hide the display area

            // Reset visual state of topic items
            predefinedTopicItems.forEach(li => {
                li.classList.remove('selected');
                li.innerHTML = li.dataset.originalText; // Restore original text
            });

            prefilledOnce = false; // Reset the flag
            textSendButton.textContent = '📩 Enviar Texto'; // Reset button text
        }
    }

    // Handle Radar Analitico card click to show overlay
    const radarAnaliticoCard = document.getElementById('radar-analitico-card');
    const radarDetailsOverlay = document.getElementById('radar-details-overlay');
    const closeButtonRadar = document.querySelector('#radar-details-overlay .close-button');

    if (radarAnaliticoCard && radarDetailsOverlay && closeButtonRadar) {
        radarAnaliticoCard.style.cursor = 'pointer';
        radarAnaliticoCard.addEventListener('click', () => {
            openOverlay(radarDetailsOverlay);
        });

        closeButtonRadar.addEventListener('click', () => {
            closeOverlay(radarDetailsOverlay);
        });
    }

    // Handle "Integração de Dados" card click to show its specific overlay
    const integracaoDadosCard = document.getElementById('integracao-dados-card');
    const integracaoDetailsOverlay = document.getElementById('integracao-details-overlay');
    const closeButtonIntegracao = document.querySelector('#integracao-details-overlay .close-button');

    if (integracaoDadosCard && integracaoDetailsOverlay && closeButtonIntegracao) {
        integracaoDadosCard.style.cursor = 'pointer';
        integracaoDadosCard.addEventListener('click', () => {
            if (radarDetailsOverlay) closeOverlay(radarDetailsOverlay); // Hide the radar overlay
            openOverlay(integracaoDetailsOverlay); // Show the new integration overlay
        });

        closeButtonIntegracao.addEventListener('click', () => {
            closeOverlay(integracaoDetailsOverlay); // Hide the integration overlay
        });
    }

    // Handle "Zonas Criticas e Padrões" card click to show its specific overlay
    const zonasCriticasCard = document.getElementById('zonas-criticas-card');
    const zonasCriticasOverlay = document.getElementById('zonas-criticas-overlay');
    const closeButtonZonasCriticas = document.querySelector('#zonas-criticas-overlay .close-button');

    if (zonasCriticasCard && zonasCriticasOverlay && closeButtonZonasCriticas) {
        zonasCriticasCard.style.cursor = 'pointer';
        zonasCriticasCard.addEventListener('click', () => {
            if (radarDetailsOverlay) closeOverlay(radarDetailsOverlay); // Hide the radar overlay
            openOverlay(zonasCriticasOverlay); // Show the new zonas criticas overlay

            // Initialize map only if it hasn't been initialized yet
            if (!zonasCriticasMap) {
                // Ensure the map container is visible before initializing
                const mapaRiscoDiv = document.getElementById('mapa-risco');
                if (mapaRiscoDiv) {
                    zonasCriticasMap = L.map('mapa-risco').setView([-15.793889, -47.882778], 11);

                    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
                      subdomains: 'abcd',
                      maxZoom: 19
                    }).addTo(zonasCriticasMap);

                    // Add markers and circles
                    L.marker([-15.83, -48.05]).addTo(zonasCriticasMap)
                      .bindPopup('<b>Ceilândia Norte</b><br>12 relatos de assaltos nos últimos 7 dias');

                    L.circle([-15.85, -47.95], {
                      color: 'red',
                      fillColor: '#f03',
                      fillOpacity: 0.4,
                      radius: 700
                    }).addTo(zonasCriticasMap).bindPopup('Área crítica com baixa iluminação e 5 incidentes entre 18h e 22h.');

                    L.circle([-15.79, -47.88], {
                      color: 'orange',
                      fillColor: '#ffa726',
                      fillOpacity: 0.3,
                      radius: 500
                    }).addTo(zonasCriticasMap).bindPopup('Aumento de furtos após as 20h. 7 relatos de vandalismo no último mês.');

                    // Add more specific markers for the patterns mentioned in the HTML
                    L.marker([-15.835, -48.04]).addTo(zonasCriticasMap)
                      .bindPopup('<b>Taguatinga</b><br>Aumento de assaltos entre 19h e 21h');

                    L.marker([-15.88, -48.10]).addTo(zonasCriticasMap)
                      .bindPopup('<b>Riacho Fundo</b><br>Incidentes recorrentes próximos a escolas (12h-14h e 17h-18h).');

                    L.marker([-15.75, -47.88]).addTo(zonasCriticasMap)
                      .bindPopup('<b>Asa Sul</b><br>Ponto de tráfico em praças específicas nos finais de semana.');

                    L.marker([-15.81, -48.08]).addTo(zonasCriticasMap)
                      .bindPopup('<b>Gama</b><br>Crescimento de denúncias de arrombamentos e carros abandonados nas madrugadas.');
                    
                    // Marcadores e áreas de risco adicionais
                    // Plano Piloto - Centro de Brasília
                    L.marker([-15.7942, -47.8822]).addTo(zonasCriticasMap)
                      .bindPopup('<b>Plano Piloto</b><br>Denúncias de vandalismo em praças e parques');

                    // Asa Norte
                    L.circle([-15.7650, -47.8750], {
                      color: 'orange',
                      fillColor: '#ffa726',
                      fillOpacity: 0.3,
                      radius: 600
                    }).addTo(zonasCriticasMap).bindPopup('Aumento de furtos em estabelecimentos comerciais');

                    // Taguatinga
                    L.marker([-15.8320, -48.0833]).addTo(zonasCriticasMap)
                      .bindPopup('<b>Taguatinga</b><br>Relatos de assaltos entre 19h e 21h');

                    // Gama
                    L.circle([-15.9500, -48.1100], {
                      color: 'red',
                      fillColor: '#f03',
                      fillOpacity: 0.4,
                      radius: 800
                    }).addTo(zonasCriticasMap).bindPopup('Crescimento de denúncias nas madrugadas');

                    // Riacho Fundo
                    L.marker([-15.9000, -48.0000]).addTo(zonasCriticasMap)
                      .bindPopup('<b>Riacho Fundo</b><br>Incidentes próximos a escolas entre 12h e 14h');

                    // Sobradinho
                    L.circle([-15.6367, -47.7894], {
                      color: 'orange',
                      fillColor: '#ffa726',
                      fillOpacity: 0.3,
                      radius: 500
                    }).addTo(zonasCriticasMap).bindPopup('Aumento de ocorrências de vandalismo');

                    // Santa Maria
                    L.marker([-15.8844, -48.1300]).addTo(zonasCriticasMap)
                      .bindPopup('<b>Santa Maria</b><br>Relatos de falta de iluminação e insegurança');
                }

            }
            // Invalidate size ensures the map renders correctly after the div becomes visible
            if (zonasCriticasMap) {
                zonasCriticasMap.invalidateSize();
            }
        });

        closeButtonZonasCriticas.addEventListener('click', () => {
            closeOverlay(zonasCriticasOverlay); // Hide the zonas criticas overlay
        });
    }

    // Handle "Painéis e Mapas Dinâmicos" AND "Tomada de Decisão Baseada em Dados" card click
    const paneisMapasDinamicosCard = document.getElementById('paneis-mapas-dinamicos-card');
    const tomadaDecisaoCard = document.getElementById('tomada-decisao-card'); // New ID for "Tomada de Decisão" card
    const restrictedAccessOverlay = document.getElementById('restricted-access-overlay');
    const dashboardOverlay = document.getElementById('dashboard-overlay');
    const closeButtonRestrictedAccess = document.querySelector('#restricted-access-overlay .close-button');
    const closeButtonDashboard = document.querySelector('#dashboard-overlay .close-button');
    const registerAccessButton = document.getElementById('register-access-button');
    const companyNameInput = document.getElementById('company-name');
    const cnpjInput = document.getElementById('cnpj');
    const corporateEmailInput = document.getElementById('corporate-email');
    const passwordInput = document.getElementById('password');
    const loadingMessage = document.getElementById('loading-message');
    const successMessage = document.getElementById('success-message');

    // Dashboard tabs and content
    const dashboardTabs = document.querySelectorAll('.dashboard-tabs .tab-btn');
    const dashboardContents = document.querySelectorAll('.tab-content');

    function openDashboard(initialTab = 'summary') {
        if (radarDetailsOverlay) closeOverlay(radarDetailsOverlay); // Hide the radar overlay
        closeOverlay(restrictedAccessOverlay); // Ensure login is hidden
        openOverlay(dashboardOverlay); // Show dashboard

        // Activate the initial tab
        dashboardTabs.forEach(tab => tab.classList.remove('active'));
        dashboardContents.forEach(content => content.classList.remove('active'));

        const targetTabButton = document.querySelector(`.tab-btn[data-tab="${initialTab}"]`);
        const targetTabContent = document.getElementById(`dashboard-${initialTab}`);
        
        if (targetTabButton) targetTabButton.classList.add('active');
        if (targetTabContent) targetTabContent.classList.add('active');

        // Initialize maps and charts relevant to the active tab
        if (initialTab === 'heatmap' && dashboardMap) {
            dashboardMap.invalidateSize(); // Invalidate map size when it becomes visible
        } else if (initialTab === 'summary') {
            updateDashboardCharts();
        } else if (initialTab === 'flow') {
            initPopulationFlowChart();
        } else if (initialTab === 'historical') {
            initHistoricalCharts();
        }
    }

    if (paneisMapasDinamicosCard && restrictedAccessOverlay && dashboardOverlay &&
        closeButtonRestrictedAccess && closeButtonDashboard && registerAccessButton) {

        paneisMapasDinamicosCard.style.cursor = 'pointer';
        paneisMapasDinamicosCard.addEventListener('click', () => {
            openOverlay(restrictedAccessOverlay); // Show restricted access form
            // Reset form and messages
            companyNameInput.value = '';
            cnpjInput.value = '';
            corporateEmailInput.value = '';
            passwordInput.value = '';
            loadingMessage.style.display = 'none';
            successMessage.style.display = 'none';
        });

        // Event listener for the new "Tomada de Decisão Baseada em Dados" card
        if (tomadaDecisaoCard) {
            tomadaDecisaoCard.style.cursor = 'pointer';
            tomadaDecisaoCard.addEventListener('click', () => {
                openOverlay(restrictedAccessOverlay); // Show restricted access form
                // Reset form and messages
                companyNameInput.value = '';
                cnpjInput.value = '';
                corporateEmailInput.value = '';
                passwordInput.value = '';
                loadingMessage.style.display = 'none';
                successMessage.style.display = 'none';
            });
        }

        closeButtonRestrictedAccess.addEventListener('click', () => {
            closeOverlay(restrictedAccessOverlay);
        });

        closeButtonDashboard.addEventListener('click', () => {
            closeOverlay(dashboardOverlay);
        });

        registerAccessButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent actual form submission

            // Show loading message
            loadingMessage.style.display = 'block';
            successMessage.style.display = 'none';

            setTimeout(() => {
                // Pre-fill form fields
                companyNameInput.value = 'Secretaria de Segurança Pública do Distrito Federal';
                cnpjInput.value = '12.345.678/0001-90';
                corporateEmailInput.value = 'contato@ssp.df.gov.br';
                passwordInput.value = '********'; // Masked password

                // Show success message
                loadingMessage.style.display = 'none';
                successMessage.style.display = 'block';

                setTimeout(() => {
                    openDashboard('summary'); // Open dashboard to the summary tab
                    // Initialize general dashboard map (used by heatmap tab)
                    initDashboardMap();

                }, 1000); // 1 second after success message
            }, 2000); // 2 seconds for loading animation
        });

        // Tab switching logic for the dashboard
        dashboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;

                // Remove active class from all tabs and contents
                dashboardTabs.forEach(t => t.classList.remove('active'));
                dashboardContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab and its content
                tab.classList.add('active');
                document.getElementById(`dashboard-${targetTab}`).classList.add('active');

                // Initialize maps/charts if they are becoming visible
                if (targetTab === 'heatmap' && dashboardMap) {
                    dashboardMap.invalidateSize(); // Invalidate map size when it becomes visible
                } else if (targetTab === 'summary') {
                    updateDashboardCharts();
                } else if (targetTab === 'flow') {
                    initPopulationFlowChart();
                } else if (targetTab === 'historical') {
                    initHistoricalCharts();
                }
            });
        });

        // Simulated report generation
        const generatePrivateReportBtn = document.getElementById('generate-private-report');
        const downloadPrivateReportExcelBtn = document.getElementById('download-private-report-excel');
        const reportPreviewMessage = document.getElementById('report-preview-message');

        if (generatePrivateReportBtn) {
            generatePrivateReportBtn.addEventListener('click', () => {
                const partnerName = document.getElementById('partner-name').value || 'Mercado Feliz Ltda.';
                const reportPeriod = document.getElementById('report-period').value || 'Maio/2024';
                reportPreviewMessage.textContent = `Relatório gerado com sucesso para ${partnerName} - ${reportPeriod}!`;
                reportPreviewMessage.style.display = 'block';
                setTimeout(() => {
                    reportPreviewMessage.style.display = 'none';
                }, 3000);
            });
        }
        if (downloadPrivateReportExcelBtn) {
            downloadPrivateReportExcelBtn.addEventListener('click', () => {
                const partnerName = document.getElementById('partner-name').value || 'Mercado Feliz Ltda.';
                const reportPeriod = document.getElementById('report-period').value || 'Maio/2024';
                alert(`Simulando download do relatório Excel para ${partnerName} - ${reportPeriod}`);
            });
        }

        // Apply Historical Filters (simulated)
        const applyHistoricalFiltersBtn = document.getElementById('apply-historical-filters');
        if (applyHistoricalFiltersBtn) {
            applyHistoricalFiltersBtn.addEventListener('click', () => {
                alert('Filtros históricos aplicados! (Simulação)');
                initHistoricalCharts(); // Re-render charts with (simulated) new data
            });
        }
    }

    // NEW: Parceria com Empresas section functionality
    const parceriaContatoButton = document.getElementById('parceria-contato-button');
    const parceriaContatoOverlay = document.getElementById('parceria-contato-overlay');
    const closeButtonParceriaContato = document.querySelector('#parceria-contato-overlay .close-button');
    const parceriaContactForm = document.querySelector('.parceria-contact-form');
    
    // New elements for the updated flow
    const parceriaFormWrapper = document.getElementById('parceria-form-wrapper');
    const parceriaConfirmationScreen = document.getElementById('parceria-confirmation-screen');
    const parceriaConfirmationOkButton = document.getElementById('parceria-confirmation-ok');

    // Form fields for auto-fill and reset
    const companyNameParceria = document.getElementById('company-name-parceria');
    const responsibleNameParceria = document.getElementById('responsible-name-parceria');
    const emailParceria = document.getElementById('email-parceria');
    const phoneParceria = document.getElementById('phone-parceria');
    const messageParceria = document.getElementById('message-parceria');
    const submitParceriaButton = document.getElementById('submit-parceria-form');

    let isParceriaFormPrefilled = false; // State tracker for the form

    function resetParceriaContactForm() {
        if (parceriaContactForm) {
            parceriaContactForm.reset();
        }
        isParceriaFormPrefilled = false;
        if(submitParceriaButton) {
            submitParceriaButton.textContent = 'Enviar Mensagem';
        }
        
        // Ensure form is visible and confirmation is hidden on reset
        if (parceriaFormWrapper) parceriaFormWrapper.style.display = 'block';
        if (parceriaConfirmationScreen) parceriaConfirmationScreen.style.display = 'none';
    }

    if (parceriaContatoButton && parceriaContatoOverlay) {
        parceriaContatoButton.addEventListener('click', () => {
            resetParceriaContactForm(); // Ensure form is clean when opened
            openOverlay(parceriaContatoOverlay);
        });

        if (closeButtonParceriaContato) {
            closeButtonParceriaContato.addEventListener('click', () => {
                closeOverlay(parceriaContatoOverlay);
            });
        }

        // Event listener for click outside the overlay content
        parceriaContatoOverlay.addEventListener('click', function handler(event) {
            if (event.target === parceriaContatoOverlay) {
                closeOverlay(parceriaContatoOverlay);
                parceriaContatoOverlay.removeEventListener('click', handler);
            }
        });

        if (parceriaContactForm) {
            parceriaContactForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent actual form submission

                // Check if the form is empty
                const isFormEmpty = !companyNameParceria.value && !responsibleNameParceria.value && !emailParceria.value && !phoneParceria.value && !messageParceria.value;

                if (isFormEmpty && !isParceriaFormPrefilled) {
                    // First click: Pre-fill the form
                    companyNameParceria.value = 'Segurança Total S.A.';
                    responsibleNameParceria.value = 'Carla Monteiro';
                    emailParceria.value = 'carla@segtotal.com.br';
                    phoneParceria.value = '(61) 99876-5432';
                    messageParceria.value = 'Olá! Temos interesse em nos tornar parceiros da plataforma para fortalecer a segurança urbana em nossa região de atuação.';
                    
                    isParceriaFormPrefilled = true;
                    submitParceriaButton.textContent = 'Confirmar Envio'; // Update button text
                } else {
                    // Subsequent click (or if form was filled manually): "Submit" and show confirmation
                    if (parceriaFormWrapper) parceriaFormWrapper.style.display = 'none';
                    if (parceriaConfirmationScreen) parceriaConfirmationScreen.style.display = 'block';
                }
            });
        }
        
        if (parceriaConfirmationOkButton) {
            parceriaConfirmationOkButton.addEventListener('click', () => {
                 closeOverlay(parceriaContatoOverlay);
            });
        }

    }
});