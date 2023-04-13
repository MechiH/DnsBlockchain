# DNSChain

DNSChain is a custom blockchain implementation designed for building a DNS registry based on blockchain technology. This project is developed using Node.js and uses a proof-of-work consensus mechanism similar to Bitcoin. The DNSCoin cryptocurrency is used for managing domain registration and maintenance.

## Getting Started

### Prerequisites

- Node.js version 14 or later
- Docker (if running the app in a container)

### Installing

1. Clone this repository to your local machine
2. Install dependencies using npm:

```
npm install
```



### Running the App

To run the app, you can either run it directly or using Docker.

#### Running the App Directly

To start the app directly, run the following command:

```
npm start
```

This will start the app using the `start` script defined in the `package.json` file.

#### Running the App with Docker

To run the app using Docker, you need to build a Docker image first. To do this, run the following command in your terminal:

```
docker build -t dnschain .
```

This will build a Docker image with the tag `dnschain`. Once the image is built, you can start a container using the following command:

```
docker run -p 3000:3000 dnschain
```

This will start a container running the DNSChain app, and forward port 3000 from the container to port 3000 on your local machine.

## Usage

Once the app is running, you can interact with it using the web interface. To access the web interface, open a web browser and go to `http://localhost:3000`.

In the web interface, you can create a wallet, register a domain, transfer domain ownership, and revoke domains. You can also view the current blockchain status and browse previously registered domains.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
