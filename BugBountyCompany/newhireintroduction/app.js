if (new URLSearchParams(location.search).get('from') === 'leadcybersecurity') {
  document.querySelector('#open-dashboard').href = '/leadcybersecurity/';
  const workspaceLink = document.querySelector('header a');
  workspaceLink.href = '/leadcybersecurity/';
  workspaceLink.textContent = 'Lead Cybersecurity';
}
