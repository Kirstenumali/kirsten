// Tool references: https://github.com/crytic/slither, https://getfoundry.sh/forge/overview/,
// https://portswigger.net/burp/documentation/desktop/getting-started/intercepting-http-traffic,
// https://www.wireshark.org/docs/wsug_html_chunked/ChapterIntroduction.html
module.exports=(scope,focus='')=>{
 const text=(scope+'\n'+focus).toLowerCase();
 const contract=/smart[- ]contract|solidity|vyper|reentrancy|\.sol\b/.test(text);
 const rust=/solana|\brust\b|\banchor\b/.test(text);
 const solidity=/solidity|vyper|\.sol\b|limit.order|fusion.protocol/.test(text) || (contract && !rust);
 const focusStep=focus.trim()?'Locate the code or feature matching this focus: '+focus.trim().slice(0,350):'Locate the features named in the program’s Focus Area and write down their expected behavior.';
 const tools=[];
 if(contract || rust){
  tools.push({tool:'Git + VS Code',steps:['Open only the repositories and revisions listed as eligible in the scope. Check the current program release rule before choosing a tag.',focusStep,'Trace the relevant entry points, state changes, and permission checks. Save the file names and function names you will review.'],output:'A pinned checkout and a short list of functions to investigate.'});
  if(solidity){
   tools.push({tool:'Foundry (Forge) / existing contract test runner',steps:['Use the repository’s documented local test setup. If it already uses Hardhat, start with that runner; use Forge for a Foundry project.','Run the existing tests locally and record the baseline results.','Add a small test around one focus-area behavior. Compare the expected state with the actual state after the operation.'],output:'A reproducible local test and its expected-versus-actual result.'});
   tools.push({tool:'Slither',steps:['For an eligible Solidity or Vyper repository, match the compiler and build configuration to the checked-out revision.','Run Slither locally on that checkout. Filter findings to the functions and issue classes in your focus area.','Read the flagged source manually and confirm a relevant finding with a local test. Discard excluded, duplicate, and unsupported findings.'],output:'A manually reviewed shortlist, not an unverified scanner report.'});
  }
  if(rust)tools.push({tool:'Cargo / Anchor test runner',steps:['Open the eligible Rust or Solana repository and follow its documented local test setup.','Run the existing tests in the project’s local environment.','Add a focused test around an allowed account-validation or state-transition behavior and record the result.'],output:'A local test case for the eligible Rust or Solana component.'});
 }else if(/packet|network traffic|pcap|network protocol/.test(text)){
  tools.push({tool:'Wireshark',steps:['Choose your own test interface or a capture you are authorized to inspect. Apply a filter for the explicitly eligible host or protocol.','Perform one normal operation with your own test account or device and record the matching packets.','Compare the observed protocol flow with its documented behavior. Save only the packets needed to demonstrate the discrepancy.'],output:'A small packet capture with timestamps and a description of the observed discrepancy.'});
 }else{
  tools.push({tool:'Browser DevTools',steps:['Open an explicitly eligible application in your browser and sign in with your own test account.','Use the Network panel while performing one normal action in the chosen focus area. Record the related endpoint, method, and response fields.','Map the intended permissions and expected behavior before selecting a specific check.'],output:'A short list of eligible requests and the expected behavior for each.'});
  tools.push({tool:'Burp Suite Community',steps:['Set Target scope to the exact eligible hosts and use the browser proxy with your own test account.','Find the request for the selected feature in HTTP history. Keep unrelated hosts out of the review.','Where the program permits manual request testing, compare a single request with the normal flow using test data you control. Record the expected and actual response.'],output:'A minimal, reproducible request-and-response record.'});
 }
 tools.push({tool:'Markdown editor',steps:['Write the affected eligible asset, exact version, and the behavior you verified.','List your reproduction steps and attach the local test output or minimal evidence.','Check the program’s focus areas, exclusions, known issues, and reporting rules. Send your own verified notes to the team researcher for review.'],output:'A researcher-review draft based on verified evidence.'});
 return tools;
};
