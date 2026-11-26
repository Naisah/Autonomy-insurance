"""Turn a Stitch ZIP export into the linked prototype under design/stitch/.

Usage: python design/prototype/link_stitch.py <unzipped export folder> <repo root>

1. Copies each <stitch_folder>/code.html to design/stitch/<group>/<name>.html.
2. Rewrites Stitch's internal links (../client-login/ClientLogin.html and so on)
   to the real files, relative to each page.
3. Adds proto-links.js to every page. That script wires the buttons and forms
   Stitch left unlinked (see HOTSPOTS in proto-links.js) and shows a small
   "Prototype" chip that goes back to the launcher.
Re-run it after every new Stitch export.
"""
import os, re, sys

# Stitch export folder -> file in design/stitch (without .html)
FOLDERS = {
    'admin_console_accounts_web': 'web/admin-accounts',
    'admin_console_web': 'web/admin-console',
    'agent_dashboard_web': 'web/agent-dashboard',
    'agent_desk_claims_web': 'web/agent-claims',
    'chat_with_agent_web': 'web/client-chat',
    'claim_details_clm_1042_web': 'web/client-claim-details',
    'client_claims_web': 'web/client-claims',
    'client_dashboard_web': 'web/client-dashboard',
    'client_login_web': 'web/client-login',
    'client_profile_web': 'web/client-profile',
    'client_register_web': 'web/client-register',
    'file_a_claim_web': 'web/client-file-claim',
    'landing_page_web': 'web/landing',
    'manager_dashboard_escalations_web': 'web/manager-escalations',
    'manager_dashboard_web': 'web/manager-dashboard',
    'policy_details_web': 'web/client-policy',
    'policy_estimate_web': 'web/client-estimate',
    'web_states_sheet': 'web/states',
    'agent_home_mobile': 'mobile/agent-home',
    'biometric_unlock_mobile': 'mobile/biometric-unlock',
    'chat_with_agent_mobile': 'mobile/client-chat',
    'chat_with_elena_rostova_mobile': 'mobile/agent-chat',
    'claim_clm_1042_mobile': 'mobile/client-claim-details',
    'claims_mobile': 'mobile/client-claims',
    'client_dashboard_mobile': 'mobile/client-dashboard',
    'create_account_mobile': 'mobile/register',
    'file_a_claim_mobile': 'mobile/client-file-claim',
    'policy_estimate_mobile': 'mobile/client-estimate',
    'policy_ins_4829_mobile': 'mobile/client-policy',
    'profile_mobile': 'mobile/client-profile',
    'review_estimate_mobile': 'mobile/agent-review-estimate',
    'sign_in_mobile': 'mobile/sign-in',
    'rewards_client_only_access_mobile': 'rewards/client-only-access',
    'rewards_goals_rewards_mobile': 'rewards/goals-rewards',
    'rewards_health_score_mobile': 'rewards/health-score',
    'rewards_home_mobile': 'rewards/home',
    'rewards_reward_effect_mobile': 'rewards/effect',
    'rewards_sign_in_mobile': 'rewards/signin',
}

# Stitch's link names -> file in design/stitch
TARGETS = {
    'InsuriaLanding': 'web/landing',
    'ClientLogin': 'web/client-login',
    'ClientRegister': 'web/client-register',
    'ClientDashboardWeb': 'web/client-dashboard',
    'ClientAgentChatWeb': 'web/client-chat',
    'ClientEstimateWeb': 'web/client-estimate',
    'ClientClaimsWeb': 'web/client-claims',
    'ClientProfileWeb': 'web/client-profile',
    'AgentDashboard': 'web/agent-dashboard',
    'AgentClaimsWeb': 'web/agent-claims',
    'ManagerDashboard': 'web/manager-dashboard',
    'ManagerEscalationsWeb': 'web/manager-escalations',
    'AdminDashboard': 'web/admin-console',
    'AdminAccountsWeb': 'web/admin-accounts',
    'ClientLoginMobile': 'mobile/sign-in',
    'ClientRegisterMobile': 'mobile/register',
    'MobileBiometricUnlock': 'mobile/biometric-unlock',
    'ClientDashboardMobile': 'mobile/client-dashboard',
    'ClientEstimateMobile': 'mobile/client-estimate',
    'ClientPolicyMobile': 'mobile/client-policy',
    'ClientClaimsMobile': 'mobile/client-claims',
    'ClientFileClaimMobile': 'mobile/client-file-claim',
    'ClientClaimDetailsMobile': 'mobile/client-claim-details',
    'ClientProfileMobile': 'mobile/client-profile',
    'AgentHomeMobile': 'mobile/agent-home',
    'AgentChatMobile': 'mobile/agent-chat',
    'AgentReviewEstimateMobile': 'mobile/agent-review-estimate',
    'RewardsSignIn': 'rewards/signin',
    'RewardsClientOnly': 'rewards/client-only-access',
    'RewardsHome': 'rewards/home',
    'RewardsGoals': 'rewards/goals-rewards',
    'RewardsHealthScore': 'rewards/health-score',
}
# Stitch uses ClientAgentChat for the chat on both web and mobile pages.
CONTEXT = {'ClientAgentChat': {'web': 'web/client-chat', 'mobile': 'mobile/client-chat'}}

LINK = re.compile(r"\.\./[A-Za-z0-9_-]+/([A-Za-z0-9_-]+)\.html")


def main(src, repo):
    out_root = os.path.join(repo, 'design', 'stitch')
    unknown, count = set(), 0
    for folder in sorted(os.listdir(src)):
        key = folder.replace('autonomy_insurance_', '')
        page = os.path.join(src, folder, 'code.html')
        if not os.path.isfile(page):
            continue
        if key not in FOLDERS:
            unknown.add('folder ' + folder)
            continue
        dest = FOLDERS[key]
        group = dest.split('/')[0]
        with open(page, encoding='utf-8') as f:
            html = f.read()

        def fix(m):
            nonlocal count
            name = m.group(1)
            target = TARGETS.get(name) or CONTEXT.get(name, {}).get(group)
            if not target:
                unknown.add('link ' + name)
                return m.group(0)
            count += 1
            return os.path.relpath(target + '.html', group).replace(os.sep, '/')

        html = LINK.sub(fix, html)
        tag = '<script src="../../prototype/proto-links.js" defer></script>'
        if tag not in html:
            html = html.replace('</body>', tag + '\n</body>', 1)
        out = os.path.join(out_root, dest + '.html')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, 'w', encoding='utf-8', newline='\n') as f:
            f.write(html)
    print('rewrote %d links' % count)
    if unknown:
        print('NOT MAPPED (add to FOLDERS or TARGETS):', ', '.join(sorted(unknown)))
        sys.exit(1)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
