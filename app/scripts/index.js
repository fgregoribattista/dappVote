// Import jquery
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;
// Import bootstrap
import 'bootstrap';

// Import the scss for full app (webpack will package it)
import "../styles/app.scss";

// Import the page's CSS. Webpack will know what to do with it.
//import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

import vote_artifacts from "../../build/contracts/Vote.json"
var Vote = contract(vote_artifacts);

// Import our contract artifacts and turn them into usable abstractions.
//import metaCoinArtifact from '../../build/contracts/MetaCoin.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
//const MetaCoin = contract(metaCoinArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    //MetaCoin.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      // set the provider for the Vote abstraction 
      Vote.setProvider(web3.currentProvider);

      // show current address
      var ethAddressIput = $('#ethAddress').val(accounts[0]);
      $('#ethAddress2').val(accounts[0]);

      // trigger create user when sign up is clicked
      var voteButton = $('#voteButton').click(function () {
        self.voteProposal();
        return false;
      });

      self.onClickVote();
      self.hasVoted();
      self.resultsProposal();
      //self.refreshBalance()
    });
  },

  //  setStatus: function (message) {
  //    const status = document.getElementById('status')
  //    status.innerHTML = message
  //  },
  //
  //  refreshBalance: function () {
  //    const self = this
  //
  //    let meta
  //    MetaCoin.deployed().then(function (instance) {
  //      meta = instance
  //      return meta.getBalance.call(account, { from: account })
  //    }).then(function (value) {
  //      const balanceElement = document.getElementById('balance')
  //      balanceElement.innerHTML = value.valueOf()
  //    }).catch(function (e) {
  //      console.log(e)
  //      self.setStatus('Error getting balance; see log.')
  //    })
  //  },
  //
  ////  sendCoin: function () {
  //    const self = this
  //
  //    const amount = parseInt(document.getElementById('amount').value)
  //    const receiver = document.getElementById('receiver').value
  //
  //    this.setStatus('Initiating transaction... (please wait)')
  //
  //    let meta
  //    MetaCoin.deployed().then(function (instance) {
  //      meta = instance
  //      return meta.sendCoin(receiver, amount, { from: account })
  //    }).then(function () {
  //      self.setStatus('Transaction complete!')
  //      self.refreshBalance()
  //    }).catch(function (e) {
  //      console.log(e)
  //      self.setStatus('Error sending coin; see log.')
  //    })
  //  }
  voteProposal: function () {
    var voteNo = $("#voteNo").prop("checked");
    var voteYes = $("#voteYes").prop("checked");
    if ((!voteNo) && (!voteYes)) {
      alert('You need choose one of proposal.')
      return false;
    }

    Vote.deployed().then(function (contractInstance) {
      contractInstance.setVote(voteYes, { gas: 1000000, from: web3.eth.accounts[0] }).then(function (success) {
        if (success) {
          console.log('vote successful');
          location.reload();
        } else {
          console.log('error vote');
        }
      }).catch(function (e) {
        // There was an error! Handle it.
        console.log('error vote: ', $('#ethAddress').val(), ': ', e);
      });

    });
  },

  userVoted: function (voted, vote) {
    if (voted) {
      $("#divChoseVote").addClass('d-none');
      $("#diVote").removeClass('d-none');
      // d-none

    } else {
      $("#diVote").addClass('d-none');
      $("#divChoseVote").removeClass('d-none');
    }
    $("#vote").val((vote) ? 'True' : 'False');
  },

  resultsProposal: function () {
    var self = this;
    Vote.deployed().then(function (contractInstance) {
      contractInstance.results.call().then(function (param) {
        self.printVotes([{ count: param[0].c[0] }, { count: param[1].c[0] }]);
      }).catch(function (e) {
        // There was an error! Handle it.
        console.log('error get votes: ', $('#ethAddress').val(), ': ', e);
      });
    });
  },

  hasVoted: function () {
    var self = this;
    var resu;
    Vote.deployed().then(function (contractInstance) {
      contractInstance.hasVote.call().then(function (param) {
        console.log(param);
        self.userVoted(param[0], param[1]);
      }).catch(function (e) {
        // There was an error! Handle it.
        console.log('error get votes: ', $('#ethAddress').val(), ': ', e);
      });
    });
  },

  onClickVote: function () {
    $("#labelNo").click(function () {
      $("#voteNo").prop("checked", !$("#voteNo").prop("checked"));
    });
    $("#labelYes").click(function () {
      $("#voteYes").prop("checked", !$("#voteYes").prop("checked"));
    });
  },

  printVotes: function (votes) {
    console.log(votes);
    var votYes = parseInt(votes[1].count);
    var votNo = parseInt(votes[0].count);
    var tot = votYes + votNo;
    if (tot != 0) {
      if (votYes > votNo) {
        $("#buttonYes").attr('class', 'btn btn-lg btn-primary');
        $("#buttonNo").attr('class', 'btn btn-lg btn-secondary');
      } else {
        $("#buttonNo").attr('class', 'btn btn-lg btn-primary');
        $("#buttonYes").attr('class', 'btn btn-lg btn-secondary');
      }
      $("#buttonYes").text(Math.round((votYes * 100) / tot) + '% (' + votYes + ' votes)');
      $("#buttonNo").text(Math.round((votNo * 100) / tot) + '% (' + votNo + ' votes)');
    }
  },




  // ini: function () {
  //   //initialize style functions
  //   self.onClickVote();

  // }

};

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
