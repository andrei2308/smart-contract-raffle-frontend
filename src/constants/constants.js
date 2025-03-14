export const abi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "entranceFee",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "interval",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "vrfCoordinator",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "gasLane",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "subscriptionId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "callbackGasLimit",
                "type": "uint32",
                "internalType": "uint32"
            },
            {
                "name": "deployer",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "acceptOwnership",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "checkUpkeep",
        "inputs": [
            {
                "name": "",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [
            {
                "name": "upkeepNeeded",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "enterRaffle",
        "inputs": [],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "getEntranceFee",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getIntervalOfRaffleWinnerSelection",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getLastTimestamp",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getNUM_WORDS",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint32",
                "internalType": "uint32"
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "getPlayer",
        "inputs": [
            {
                "name": "indexOfPlayer",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRaffleState",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint8",
                "internalType": "enum Raffle.RaffleState"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getRequestConfirmations",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint16",
                "internalType": "uint16"
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "getSubscriptionId",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getWinner",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "owner",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "performUpkeep",
        "inputs": [
            {
                "name": "",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "rawFulfillRandomWords",
        "inputs": [
            {
                "name": "requestId",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "randomWords",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "s_vrfCoordinator",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract IVRFCoordinatorV2Plus"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setCoordinator",
        "inputs": [
            {
                "name": "_vrfCoordinator",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "inputs": [
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "AchievementEarned",
        "inputs": [
            {
                "name": "player",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "achievementId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "CoordinatorSet",
        "inputs": [
            {
                "name": "vrfCoordinator",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OwnershipTransferRequested",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OwnershipTransferred",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RaffleEntered",
        "inputs": [
            {
                "name": "player",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "RequestedRaffleWinner",
        "inputs": [
            {
                "name": "requestId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "WinnerPicked",
        "inputs": [
            {
                "name": "winner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "OnlyCoordinatorCanFulfill",
        "inputs": [
            {
                "name": "have",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "want",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "OnlyOwnerOrCoordinator",
        "inputs": [
            {
                "name": "have",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "owner",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "coordinator",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "Raffle_RaffleNotOpen",
        "inputs": []
    },
    {
        "type": "error",
        "name": "Raffle_SendMoreToEnterRaffle",
        "inputs": []
    },
    {
        "type": "error",
        "name": "Raffle_TransferFailed",
        "inputs": []
    },
    {
        "type": "error",
        "name": "Raffle_UpkeepNotNeeded",
        "inputs": [
            {
                "name": "balance",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "playersLength",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "state",
                "type": "uint256",
                "internalType": "uint256"
            }
        ]
    },
    {
        "type": "error",
        "name": "ZeroAddress",
        "inputs": []
    }
]
export const address = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"