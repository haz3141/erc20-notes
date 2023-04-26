// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TinyNotesToken is ERC20 {
    using Counters for Counters.Counter;
    Counters.Counter private _noteIds;

    struct Note {
        address creator;
        string title;
        string content;
    }

    mapping(uint256 => Note) private idToNote;

    constructor(string memory _genesisTitle, string memory _genesisContent) ERC20("Tiny Notes Token", "TNT") {
        _mint(msg.sender, 47000000 * 10 ** decimals());
        idToNote[0] = Note(msg.sender, _genesisTitle, _genesisContent);
    }

    function createNote(string memory _title, string memory _content) public {
        require(balanceOf(address(msg.sender)) > 0, "Must hold TNT to create a Note.");
        _noteIds.increment();
        idToNote[_noteIds.current()] = Note(msg.sender, _title, _content);
    }

    function readNote(uint256 _noteId) public view returns (string memory title, string memory content) {
        Note memory note = idToNote[_noteId];
        return (note.title, note.content);
    }

    function updateNote(uint256 _noteId, string memory _newTitle, string memory _newContent) public {
        require(idToNote[_noteId].creator == msg.sender, "Only the creator may update a Note.");
        idToNote[_noteId].title = _newTitle;
        idToNote[_noteId].content = _newContent;
    }
}