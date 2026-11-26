/* Prototype wiring for the Stitch exports in design/stitch.
 * link_stitch.py adds this script to every page. It does two things:
 * 1. Wires the buttons, cards and forms that Stitch left unlinked (HOTSPOTS).
 * 2. Shows a small "Prototype" chip that goes back to the launcher.
 * Paths in HOTSPOTS are relative to design/stitch.
 */
(function () {
  'use strict';

  // Each entry: text = visible text to match (first match wins unless all: true),
  // go = target page, on = 'link' (a or button, default), 'card' (nearest card around the text),
  // or 'submit' (the form on the page, after its own handler runs).
  var HOTSPOTS = {
    'web/landing': [
      { text: 'Client Login', go: 'web/client-login' },
      { text: 'Agent Desk', go: 'web/agent-dashboard' },
      { text: 'Manager Portal', go: 'web/manager-dashboard' },
      { text: 'Admin Console', go: 'web/admin-console' },
      { text: 'Lock in this estimate', go: 'web/client-register' },
      { text: 'Chat with an agent', go: 'web/client-login' },
      { text: 'Start live chat', go: 'web/client-login' },
      { text: 'Try Chat with Agent', go: 'web/client-login' },
      { text: 'Explore Step Rewards', go: 'rewards/signin' }
    ],
    'web/client-login': [{ on: 'submit', go: 'web/client-dashboard' }],
    'web/client-register': [{ on: 'submit', go: 'web/client-dashboard' }],
    'web/client-dashboard': [
      { text: 'View Claim', go: 'web/client-claim-details' },
      { text: 'Resume Estimate', go: 'web/client-estimate' },
      { text: '20-Year Term Life', on: 'card', go: 'web/client-policy' }
    ],
    'web/client-claims': [
      { text: 'File a new claim', go: 'web/client-file-claim', all: true },
      { text: '#CLM-1042', on: 'card', go: 'web/client-claim-details' }
    ],
    'web/client-file-claim': [{ on: 'submit', go: 'web/client-claim-details' }],
    'web/client-estimate': [{ text: 'View policy', go: 'web/client-policy' }],
    'web/client-profile': [{ text: 'Connect Rewards app', on: 'card', go: 'rewards/signin' }],
    'mobile/biometric-unlock': [{ text: 'Unlock with Face ID', go: 'BIOMETRIC' }],
    'mobile/client-dashboard': [
      { text: 'Resume', go: 'mobile/client-estimate' },
      { text: 'Active Policy', on: 'card', go: 'mobile/client-policy' },
      { text: 'Wellness Rider', on: 'card', go: 'mobile/client-claim-details' }
    ],
    'mobile/client-file-claim': [{ on: 'submit', go: 'mobile/client-claim-details' }],
    'rewards/health-score': [{ text: 'Extended Grace', on: 'card', go: 'rewards/effect' }]
  };

  var src = (document.currentScript && document.currentScript.src) || '';
  var base = src.replace(/prototype\/proto-links\.js.*$/, ''); // .../design/
  var m = location.pathname.match(/stitch\/(web|mobile|rewards)\/([a-z0-9-]+)\.html$/);
  if (!m) return;
  var page = m[1] + '/' + m[2];

  function url(target) { return base + 'stitch/' + target + '.html'; }
  function go(target) { location.href = url(target); }

  function textOf(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }

  function find(text, all, anyEl) {
    var sel = anyEl ? 'body *' : 'a, button, [role="button"]';
    var hits = [];
    document.querySelectorAll(sel).forEach(function (el) {
      if (textOf(el).indexOf(text) === -1) return;
      // keep the deepest element that contains the text
      if (anyEl && Array.prototype.some.call(el.children, function (c) { return textOf(c).indexOf(text) !== -1; })) return;
      hits.push(el);
    });
    return all ? hits : hits.slice(0, 1);
  }

  function wire(el, target, isCard) {
    if (el.tagName === 'A') { el.setAttribute('href', url(target)); return; }
    el.style.cursor = 'pointer';
    el.addEventListener('click', function (e) {
      // on a card, let its own links and buttons keep working
      if (isCard) { var inner = e.target.closest('a, button'); if (inner && inner !== el) return; }
      e.preventDefault(); e.stopPropagation(); go(target);
    }, !isCard);
  }

  (HOTSPOTS[page] || []).forEach(function (h) {
    if (h.on === 'submit') {
      document.querySelectorAll('form').forEach(function (f) {
        if (f.offsetParent === null) return; // skip hidden forms
        f.addEventListener('submit', function () { setTimeout(function () { go(h.go); }, 400); });
      });
      return;
    }
    if (h.go === 'BIOMETRIC') {
      find(h.text).forEach(function (el) {
        el.addEventListener('click', function () {
          var badge = document.getElementById('user-badge');
          var agent = badge && /agent/i.test(badge.textContent);
          setTimeout(function () { go(agent ? 'mobile/agent-home' : 'mobile/client-dashboard'); }, 500);
        });
      });
      return;
    }
    if (h.on === 'card') {
      find(h.text, false, true).forEach(function (el) {
        var card = el.closest('[class*="rounded"][class*="border"]') || el;
        wire(card, h.go, true);
      });
      return;
    }
    find(h.text, h.all).forEach(function (el) { wire(el, h.go); });
  });

  // Back-to-launcher chip
  var chip = document.createElement('a');
  chip.href = base + 'prototype/index.html';
  chip.target = '_top';
  chip.textContent = 'Prototype';
  chip.title = 'Back to the prototype launcher';
  chip.setAttribute('style', [
    'position:fixed', 'left:12px', 'bottom:96px', 'z-index:2147483647',
    'padding:6px 12px', 'border-radius:9999px', 'background:#1B1B1D', 'color:#fff',
    'font:600 12px/16px "DM Sans",system-ui,sans-serif', 'text-decoration:none',
    'opacity:.55', 'box-shadow:0 2px 8px rgba(0,0,0,.2)'
  ].join(';'));
  chip.onmouseenter = function () { chip.style.opacity = '1'; };
  chip.onmouseleave = function () { chip.style.opacity = '.55'; };
  document.body.appendChild(chip);
})();
