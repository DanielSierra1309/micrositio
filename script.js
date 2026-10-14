document.addEventListener('DOMContentLoaded', function() {
  
  // 0. Lógica de Dark Mode (Modo Oscuro) con persistencia en localStorage
  var themeToggleBtn = document.getElementById('theme-toggle');
  var htmlElement = document.documentElement;

  // Cargar tema guardado previamente
  var savedTheme = localStorage.getItem('fsc_theme') || 'light';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      var currentTheme = htmlElement.getAttribute('data-theme');
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('fsc_theme', newTheme);
    });
  }

  // 1. Lógica interactiva para las tarjetas de Métricas del Diagnóstico
  var metricCards = document.querySelectorAll('.metric-card');
  var detailPanel = document.getElementById('metric-detail-panel');
  var detailTitle = document.getElementById('metric-detail-title');
  var detailConcept = document.getElementById('metric-detail-concept');
  var detailFinding = document.getElementById('metric-detail-finding');
  var closeBtn = document.getElementById('close-metric-detail');

  var metricData = {
    controles: {
      title: '97 Controles Auditados',
      concept: 'Un control de seguridad es una regla, configuración técnica o política evaluada para garantizar que los sistemas corporativos estén protegidos según las mejores prácticas internacionales.',
      finding: 'Se evaluaron 97 parámetros técnicos del estándar de ciberseguridad SCUBA de CISA para Microsoft 365, analizando desde los métodos de inicio de sesión hasta las reglas de acceso a archivos e identidades.'
    },
    fallos: {
      title: '39 Fallos Críticos',
      concept: 'Un fallo crítico representa una vulnerabilidad de alta severidad que deja una brecha directa para ciberataques, robo de contraseñas o filtración de información sensible si no se soluciona.',
      finding: 'Se detectaron 39 configuraciones deficientes, destacando la falta de autenticación multifactor (MFA) obligatoria, permisos ilimitados para conectar apps web de terceros y enlaces públicos anónimos en SharePoint.'
    },
    advertencias: {
      title: '15 Advertencias',
      concept: 'Una advertencia señala configuraciones intermedias que, aunque no representan un peligro inminente, reducen la capacidad de prevención, detección temprana y monitoreo frente a comportamientos sospechosos.',
      finding: 'Se identificaron 15 alertas de riesgo moderado, entre ellas la falta de límites de caducidad en enlaces compartidos, ausencia de registros de auditoría avanzados y alertas de seguridad desactivadas.'
    },
    areas: {
      title: '4 Áreas Analizadas',
      concept: 'Son las cuatro plataformas centrales de la infraestructura de Microsoft 365 donde el equipo de la Fundación realiza sus labores cotidianas e interactúa con datos institucionales.',
      finding: 'La auditoría cubrió 4 pilares: Entra ID (Gestión de Usuarios e Identidades), Exchange Online (Correo Electrónico), SharePoint / OneDrive (Archivos y Nube) y Defender (Antivirus y Alertas de Seguridad).'
    }
  };

  var currentMetric = null;

  metricCards.forEach(function(card) {
    card.addEventListener('click', function() {
      var key = card.getAttribute('data-metric');
      
      if (currentMetric === key) {
        closeMetricPanel();
        return;
      }

      metricCards.forEach(function(c) { c.classList.remove('is-active'); });
      card.classList.add('is-active');

      var data = metricData[key];
      if (data && detailPanel) {
        detailTitle.textContent = data.title;
        detailConcept.textContent = data.concept;
        detailFinding.textContent = data.finding;
        detailPanel.style.display = 'block';
        currentMetric = key;
        
        // Scroll suave hacia el panel de detalle
        detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  function closeMetricPanel() {
    if (detailPanel) detailPanel.style.display = 'none';
    metricCards.forEach(function(c) { c.classList.remove('is-active'); });
    currentMetric = null;
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMetricPanel);
  }

  // 2. Desplegables de las 9 tarjetas de conceptos
  document.querySelectorAll('.concept-card').forEach(function(card) {
    var btn = card.querySelector('.concept-toggle');
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var isOpen = card.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen);
        var toggleText = card.querySelector('.toggle-text');
        if (toggleText) {
          toggleText.textContent = isOpen ? 'Ocultar definición' : 'Ver definición y detalles';
        }
      });
    }
  });

  // 3. Desplegables de los 5 riesgos detectados
  document.querySelectorAll('.risk-card').forEach(function(card) {
    var btn = card.querySelector('.risk-toggle');
    var panel = card.querySelector('.risk-panel');
    if (btn && panel) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var isOpen = card.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen);
        panel.setAttribute('aria-hidden', !isOpen);
        if (isOpen) {
          panel.removeAttribute('inert');
        } else {
          panel.setAttribute('inert', '');
        }
      });
    }
  });

  // 4. Lógica interactiva del Buzón de Sugerencias (Almacenamiento Local)
  var sugForm = document.getElementById('suggestion-form');
  var sugFeedback = document.getElementById('form-feedback');

  if (sugForm) {
    sugForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var nameVal = document.getElementById('sug-name').value.trim();
      var areaVal = document.getElementById('sug-area').value.trim();
      var textVal = document.getElementById('sug-text').value.trim();

      if (textVal === '') return;

      try {
        var storedList = JSON.parse(localStorage.getItem('fsc_suggestions_data') || '[]');
        storedList.push({
          nombre: nameVal || 'Anónimo',
          area: areaVal || 'No especificada',
          comentario: textVal,
          fecha: new Date().toLocaleString('es-CO')
        });
        localStorage.setItem('fsc_suggestions_data', JSON.stringify(storedList));
      } catch(err) {
        console.log('Error de almacenamiento local:', err);
      }

      sugForm.reset();
      if (sugFeedback) {
        sugFeedback.style.display = 'block';
        sugFeedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>¡Gracias por tu aporte!</strong> Tu sugerencia ha sido registrada exitosamente. El área de administración revisará tus comentarios para seguir mejorando nuestras políticas.';
        
        setTimeout(function() {
          sugFeedback.style.display = 'none';
        }, 8000);
      }
    });
  }
});
