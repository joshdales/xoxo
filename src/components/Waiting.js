import React from 'react';
import base from '../base';
import CopyToClipboard from 'react-copy-to-clipboard';

export default class Waiting extends React.Component {
  constructor() {
    super();
    this.state = {
      game: {},
      url: '',
      copied: false
    }
  }

  componentDidMount() {
    this.setState({
      url: `${location.protocol}//${location.host}/join/${this.props.params.gameId}`
    })

    base.listenTo(`game/${this.props.params.gameId}`, {
      context: this,
      then(game){
        if (game.player2Token) {
          this.context.router.transitionTo(`/game/${this.props.params.gameId}`);
        }

        this.setState({game});
      }
    });
  }

  sendToPhone(e) {
    e.preventDefault();
  }

  render() {
    const {player1Name, player2Name} = this.state.game;

    return(
      <div className="waiting">
        <h2>
          Howdy <span className="playerName">{player1Name}</span>! Send a message to <span className="playerName">{player2Name}</span> to start the game!
        </h2>

        <div className="waiting-form-container">
          <form className="gameForm" onSubmit={(e) => {this.sendToPhone(e)}}>
            <div className="player-input">
              <input ref={(input) => {this.phone = input}} type="tel" placeholder="Enter phone Number" name="tel"/>
            </div>
            <button type="submit">SEND</button>
          </form>
        </div>

        <CopyToClipboard text={this.state.url}
          onCopy={() => this.setState({copied: true})}>
          <div className="copy">
            <span>{this.state.url}</span>
            {
              this.state.copied ?
              <img src="/OK.png" alt="copy-to-clipboard"/>
              :
              <img src="/copyToClip.png" alt="copy-to-clipboard"/>
            }

          </div>
        </CopyToClipboard>
      </div>
    )
  }
}

Waiting.contextTypes = {
  router: React.PropTypes.object
}