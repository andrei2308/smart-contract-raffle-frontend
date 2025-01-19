# Smart Contract Raffle Frontend

This repository contains the frontend for the Smart Contract Raffle project. It is designed to interact with the smart contract deployed and managed through the corresponding backend repository.

## Related Repositories

- **Frontend Repository (this repo):** [smart-contract-raffle-frontend](https://github.com/andrei2308/smart-contract-raffle-frontend)
- **Backend Repository:** [foundry-raffle-smart-contract](https://github.com/andrei2308/foundry-raffle-smart-contract)

The backend repository contains the smart contract code, written in Solidity and developed using Foundry, to manage the raffle logic and blockchain interactions.

## Project Overview

The Smart Contract Raffle project is a decentralized raffle system where users can enter the raffle by interacting with the smart contract via this frontend. The frontend provides an intuitive UI for users to:

- Enter the raffle by submitting their entries.
- View the current raffle status.
- Check raffle history and winners.

## Features

- **User-friendly Interface:** Easily interact with the raffle contract.
- **Web3 Integration:** Seamlessly connects with Ethereum wallets.
- **Real-time Updates:** Displays live raffle information.
- **Smart Contract Interaction:** Allows users to participate and view results.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/andrei2308/smart-contract-raffle-frontend.git
   cd smart-contract-raffle-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an `.env` file and configure environment variables (e.g., Infura API key, contract address).

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Ensure you have a Web3 wallet (e.g., MetaMask) installed and connected to the appropriate blockchain network.
2. Access the application in your browser at `http://localhost:3000`.
3. Enter the raffle by submitting entries through the UI.

## Technologies Used

- React.js
- Next.js
- Ethers.js
- Tailwind CSS
- Web3.js

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to help improve the project.

## License

This project is licensed under the MIT License.

---

### Acknowledgment

This project is built as part of a decentralized application initiative using Foundry for smart contract development.

For more details on the smart contract, visit the backend repository: [foundry-raffle-smart-contract](https://github.com/andrei2308/foundry-raffle-smart-contract).

