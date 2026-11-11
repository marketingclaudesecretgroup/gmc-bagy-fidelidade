/**
 * Bagy Loyalty Program & Google Merchant Center Storefront Widget
 * Standalone embeddable script for Bagy Stores
 */
(function () {
  'use strict';

  // Prevent duplicate initialization
  if (window.__BAGY_LOYALTY_WIDGET_LOADED__) return;
  window.__BAGY_LOYALTY_WIDGET_LOADED__ = true;

  const API_BASE = window.BAGY_LOYALTY_API_BASE || '';
  let currentMember = null;
  let isOpen = false;

  // Retrieve customer email if exposed by Bagy storefront or cached in localStorage
  let customerEmail = 
    window.__BAGY_CUSTOMER__?.email || 
    localStorage.getItem('bagy_loyalty_customer_email') || 
    'carolina.mendes@gmail.com'; // demo default

  // Inject Styles into Shadow Root or Head
  const host = document.createElement('div');
  host.id = 'bagy-loyalty-root';
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    
    .launcher-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 9999px;
      border: 1px solid rgba(165, 180, 252, 0.3);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.4);
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .launcher-btn:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.6), 0 0 22px rgba(99, 102, 241, 0.6);
    }
    .launcher-icon {
      width: 22px;
      height: 22px;
      display: inline-block;
    }
    .points-badge {
      background: #10b981;
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .modal-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999998;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .modal-backdrop.open {
      display: block;
      opacity: 1;
    }

    .modal-container {
      position: fixed;
      bottom: 84px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 32px);
      max-height: 600px;
      background: #0f172a;
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.2);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateY(20px) scale(0.96);
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-container.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      pointer-events: auto;
    }

    .modal-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, #1e1b4b, #0f172a);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      padding: 4px;
    }
    .close-btn:hover { color: #ffffff; }

    .modal-tabs {
      display: flex;
      background: rgba(15, 23, 42, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .tab-btn {
      flex: 1;
      padding: 10px 8px;
      text-align: center;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.15s ease;
    }
    .tab-btn.active {
      color: #a5b4fc;
      border-bottom-color: #6366f1;
      background: rgba(99, 102, 241, 0.08);
    }

    .modal-body {
      padding: 18px 20px;
      overflow-y: auto;
      flex: 1;
    }

    .user-card {
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.8), rgba(15, 23, 42, 0.9));
      border: 1px solid rgba(165, 180, 252, 0.2);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .tier-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tier-VIP { background: rgba(168, 85, 247, 0.25); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.4); }
    .tier-OURO { background: rgba(234, 179, 8, 0.25); color: #fde047; border: 1px solid rgba(234, 179, 8, 0.4); }
    .tier-PRATA { background: rgba(148, 163, 184, 0.25); color: #e2e8f0; border: 1px solid rgba(148, 163, 184, 0.4); }
    .tier-BRONZE { background: rgba(217, 119, 6, 0.25); color: #fdba74; border: 1px solid rgba(217, 119, 6, 0.4); }

    .points-highlight {
      font-size: 26px;
      font-weight: 800;
      color: #10b981;
      margin: 8px 0 2px 0;
      letter-spacing: -0.5px;
    }
    .points-sub {
      font-size: 12px;
      color: #94a3b8;
    }

    .google-perk-box {
      margin-top: 12px;
      padding: 10px 12px;
      background: rgba(26, 115, 232, 0.12);
      border: 1px solid rgba(66, 133, 244, 0.3);
      border-radius: 10px;
      font-size: 11px;
      color: #93c5fd;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .reward-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 12px 14px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border 0.15s ease;
    }
    .reward-card:hover {
      border-color: rgba(99, 102, 241, 0.4);
    }
    .reward-val {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
    }
    .reward-pts {
      font-size: 11px;
      color: #a5b4fc;
    }
    .redeem-btn {
      background: #4f46e5;
      color: #ffffff;
      border: none;
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .redeem-btn:hover { background: #4338ca; }
    .redeem-btn:disabled {
      background: #334155;
      color: #64748b;
      cursor: not-allowed;
    }

    .coupon-code-pill {
      background: #064e3b;
      color: #34d399;
      padding: 4px 10px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 12px;
      font-weight: 700;
      border: 1px dashed #059669;
      cursor: pointer;
    }

    .email-switch {
      margin-top: 14px;
      display: flex;
      gap: 6px;
    }
    .email-input {
      flex: 1;
      background: #1e293b;
      border: 1px solid #334155;
      color: #ffffff;
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 12px;
    }
    .switch-btn {
      background: #334155;
      border: none;
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
    }

    .toast {
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: #10b981;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }
    .toast.show { opacity: 1; }
  `;

  shadow.appendChild(style);

  // Template HTML
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="modal-backdrop" id="backdrop"></div>

    <button class="launcher-btn" id="launcherBtn">
      <svg class="launcher-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      <span>Clube Fidelidade</span>
      <span class="points-badge" id="launcherPoints">...</span>
    </button>

    <div class="modal-container" id="modalContainer">
      <div class="toast" id="toast">Copiado com sucesso!</div>
      
      <div class="modal-header">
        <div class="modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#a5b4fc" stroke="#6366f1" stroke-width="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Clube Fidelidade Bagy
        </div>
        <button class="close-btn" id="closeBtn">&times;</button>
      </div>

      <div class="modal-tabs">
        <button class="tab-btn active" data-tab="account">Meu Saldo</button>
        <button class="tab-btn" data-tab="rewards">Resgatar</button>
        <button class="tab-btn" data-tab="rules">Como Ganhar</button>
      </div>

      <div class="modal-body" id="modalBody">
        <div id="tabAccount">
          <div class="user-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; font-weight: 600;" id="userName">Carregando...</span>
              <span class="tier-badge tier-VIP" id="userTier">VIP</span>
            </div>
            <div class="points-highlight" id="userPoints">0 pts</div>
            <div class="points-sub" id="userPointsValue">Equivale a R$ 0,00 de desconto na Bagy</div>

            <div class="google-perk-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <strong>Google Shopping Ativo:</strong> Frete Grátis e Descontos VIP vinculados à sua Conta Google.
              </div>
            </div>
          </div>

          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px; font-weight: 600;">Seus Cupons Bagy Gerados:</div>
          <div id="activeCouponsList">
            <div style="font-size: 11px; color: #64748b;">Nenhum cupom ativo no momento. Resgate abaixo!</div>
          </div>

          <div class="email-switch">
            <input type="email" class="email-input" id="emailInput" placeholder="seu-email@bagy.com.br" value="${customerEmail}">
            <button class="switch-btn" id="switchEmailBtn">Ver</button>
          </div>
        </div>

        <div id="tabRewards" style="display: none;">
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">Troque seus pontos por cupons aplicáveis automaticamente no checkout da Bagy:</div>

          <div class="reward-card">
            <div>
              <div class="reward-val">R$ 15,00 OFF</div>
              <div class="reward-pts">Custa 300 pontos (Mínimo R$ 60)</div>
            </div>
            <button class="redeem-btn" onclick="window.__bagyRedeem(15, 300, 60)">Resgatar</button>
          </div>

          <div class="reward-card">
            <div>
              <div class="reward-val">R$ 30,00 OFF</div>
              <div class="reward-pts">Custa 600 pontos (Mínimo R$ 120)</div>
            </div>
            <button class="redeem-btn" onclick="window.__bagyRedeem(30, 600, 120)">Resgatar</button>
          </div>

          <div class="reward-card">
            <div>
              <div class="reward-val">R$ 50,00 OFF</div>
              <div class="reward-pts">Custa 1000 pontos (Mínimo R$ 180)</div>
            </div>
            <button class="redeem-btn" onclick="window.__bagyRedeem(50, 1000, 180)">Resgatar</button>
          </div>
        </div>

        <div id="tabRules" style="display: none;">
          <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px; color: #cbd5e1;">
            <div style="padding: 10px; background: rgba(30, 41, 59, 0.5); border-radius: 8px;">
              <strong style="color: #ffffff;">🛒 Compras na Bagy:</strong>
              <div>Ganhe de 1 a 2.5 pontos por cada R$ 1,00 gasto conforme o seu nível.</div>
            </div>
            <div style="padding: 10px; background: rgba(30, 41, 59, 0.5); border-radius: 8px;">
              <strong style="color: #ffffff;">🎁 Cadastro / Boas-Vindas:</strong>
              <div>100 pontos imediatos para novos membros.</div>
            </div>
            <div style="padding: 10px; background: rgba(30, 41, 59, 0.5); border-radius: 8px;">
              <strong style="color: #ffffff;">🔍 Google Merchant Center:</strong>
              <div>Membros logados com Conta Google recebem Frete Grátis e Preços Especiais no Google Shopping.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  shadow.appendChild(container);

  // References
  const launcherBtn = shadow.getElementById('launcherBtn');
  const launcherPoints = shadow.getElementById('launcherPoints');
  const modalContainer = shadow.getElementById('modalContainer');
  const backdrop = shadow.getElementById('backdrop');
  const closeBtn = shadow.getElementById('closeBtn');
  const emailInput = shadow.getElementById('emailInput');
  const switchEmailBtn = shadow.getElementById('switchEmailBtn');
  const userName = shadow.getElementById('userName');
  const userTier = shadow.getElementById('userTier');
  const userPoints = shadow.getElementById('userPoints');
  const userPointsValue = shadow.getElementById('userPointsValue');
  const activeCouponsList = shadow.getElementById('activeCouponsList');
  const toast = shadow.getElementById('toast');

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function toggleModal(open) {
    isOpen = open !== undefined ? open : !isOpen;
    if (isOpen) {
      modalContainer.classList.add('open');
      backdrop.classList.add('open');
      loadMemberData();
    } else {
      modalContainer.classList.remove('open');
      backdrop.classList.remove('open');
    }
  }

  launcherBtn.addEventListener('click', () => toggleModal(true));
  closeBtn.addEventListener('click', () => toggleModal(false));
  backdrop.addEventListener('click', () => toggleModal(false));

  // Tabs switching
  shadow.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      shadow.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-tab');
      shadow.getElementById('tabAccount').style.display = target === 'account' ? 'block' : 'none';
      shadow.getElementById('tabRewards').style.display = target === 'rewards' ? 'block' : 'none';
      shadow.getElementById('tabRules').style.display = target === 'rules' ? 'block' : 'none';
    });
  });

  // Switch customer
  switchEmailBtn.addEventListener('click', () => {
    const newEmail = emailInput.value.trim();
    if (newEmail) {
      customerEmail = newEmail;
      localStorage.setItem('bagy_loyalty_customer_email', customerEmail);
      loadMemberData();
    }
  });

  async function loadMemberData() {
    try {
      const res = await fetch(`${API_BASE}/api/loyalty/member?email=${encodeURIComponent(customerEmail)}`);
      const data = await res.json();
      if (data.success && data.member) {
        currentMember = data.member;
        launcherPoints.textContent = `${data.member.pointsBalance} pts`;
        userName.textContent = data.member.name;
        userTier.textContent = data.member.tier;
        userTier.className = `tier-badge tier-${data.member.tier}`;
        userPoints.textContent = `${data.member.pointsBalance} pts`;
        const valInBrl = (data.member.pointsBalance * 0.05).toFixed(2);
        userPointsValue.textContent = `Equivale a R$ ${valInBrl} de desconto em pedidos Bagy`;

        // Render coupons
        if (data.coupons && data.coupons.length > 0) {
          activeCouponsList.innerHTML = data.coupons.map(c => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(30, 41, 59, 0.4); padding: 8px 10px; border-radius: 8px; margin-top: 6px;">
              <div>
                <span class="coupon-code-pill" onclick="window.__bagyCopyCoupon('${c.code}')">${c.code}</span>
                <span style="font-size: 11px; color: #94a3b8; margin-left: 6px;">R$ ${c.value.toFixed(2)} OFF</span>
              </div>
              <span style="font-size: 10px; color: ${c.status === 'ACTIVE' ? '#34d399' : '#94a3b8'};">${c.status === 'ACTIVE' ? 'Pronto p/ Usar' : 'Utilizado'}</span>
            </div>
          `).join('');
        } else {
          activeCouponsList.innerHTML = `<div style="font-size: 11px; color: #64748b;">Nenhum cupom ativo no momento. Resgate na aba ao lado!</div>`;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar dados de fidelidade Bagy:', e);
    }
  }

  // Global methods exposed to widget instance
  window.__bagyRedeem = async function (value, pointsSpent, minSpend) {
    if (!currentMember) return;
    if (currentMember.pointsBalance < pointsSpent) {
      alert(`Saldo insuficiente. Você tem ${currentMember.pointsBalance} pontos e precisa de ${pointsSpent}.`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/loyalty/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerEmail,
          value,
          pointsSpent,
          minSpend
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Cupom ${data.coupon.code} criado!`);
        // If in Bagy cart, try auto-filling
        const bagyCouponInput = document.querySelector('input[name="coupon"], #coupon_code, .bagy-coupon-input');
        if (bagyCouponInput) {
          bagyCouponInput.value = data.coupon.code;
          bagyCouponInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        await loadMemberData();
        // Switch to account tab
        shadow.querySelectorAll('.tab-btn')[0].click();
      } else {
        alert(data.error || 'Erro ao resgatar pontos');
      }
    } catch (err) {
      alert('Falha na comunicação com o servidor de fidelidade.');
    }
  };

  window.__bagyCopyCoupon = function (code) {
    navigator.clipboard.writeText(code).then(() => {
      showToast('Código copiado!');
    });
  };

  // Initial load
  loadMemberData();
})();
