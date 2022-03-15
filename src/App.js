import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/jsmithb117`;
const TEST_GIFS = [
  'https://media.giphy.com/media/Wle5c6OOeNIfm/giphy.gif',
  'https://media.giphy.com/media/l1J3qq6ujgIP4QMRG/giphy.gif',
  'https://media.giphy.com/media/tyttpHfRFx6CLkrpWJa/giphy.gif',
  'https://media.giphy.com/media/3oz8xS0fUzsAoOmTrG/giphy.gif',
  'https://media.giphy.com/media/d5A33y4CfUE3kaxQfX/giphy.gif',
  'https://media.giphy.com/media/l2uluGTvB7DAQvZyHp/giphy.gif',
]
const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [input, setInput] = useState('');
  const [gifList, setGifList] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana?.isPhantom) {
        console.log("Phantom Wallet found");
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(`Connected with Public Key:
          ${response.publicKey.toString()}`);
        setWalletAddress(response.publicKey.toString());
      } else if (!solana) {
        alert("No wallet found, use Phantom Wallet");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key: ', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (input.length > 0) {
      setGifList([...gifList, input]);
      setInput('');
    } else {
      console.log('No gif link provided, try again');
    }
  }

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter a GIF URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list.');
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 Dog GIF Portal</p>
          <p className="sub-text">
            View my dog GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
