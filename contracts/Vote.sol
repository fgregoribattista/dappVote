pragma solidity ^0.4.22;

contract Vote{
    
    struct Voter {        
        bool voted;
        bool vote;        
    }

    struct Proposal {
        bytes32 name;  
        uint16 count;
    }

    mapping(address => Voter) voters;
    Proposal[] proposals;

    constructor () public{
        proposals.push(Proposal({
            name: "NO",
            count: 0
            }));
        proposals.push(Proposal({
            name: "YES",
            count: 0
            }));
        // proposals[0] = Proposal({
        //     name: "NO",
        //     count: 0
        // });
        // proposals[1] = Proposal({
        //     name: "YES",
        //     count: 0
        // });
    }

    function setVote(bool vote)public returns(bool success){
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");
        // if(sender.voted)return;
        sender.voted = true;
        sender.vote = vote;
        //proposal true=>1 (YES)|| false=>0 (NO)
        proposals[sender.vote ? 1 : 0].count += 1;
        return true;
    }
    
    function results () public view returns(uint16 _NoProposal, uint16 _YesProposal){
        _NoProposal = proposals[0].count;
        _YesProposal = proposals[1].count;
    }

    function hasVote()public view returns(bool voted, bool vote){
        Voter storage sender = voters[msg.sender];
        voted = sender.voted;
        vote = sender.vote;
    }

}