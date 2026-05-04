import { Component } from 'react';
import type { ReactNode } from 'react';

interface State {
  shouldThrow: boolean;
}

export class ErrorTrigger extends Component<object, State> {
  state: State = { shouldThrow: false };

  handleClick = (): void => {
    this.setState({ shouldThrow: true });
  };

  render(): ReactNode {
    if (this.state.shouldThrow) {
      throw new Error('Manual error triggered for ErrorBoundary test.');
    }
    return (
      <button type="button" onClick={this.handleClick}>
        Throw error
      </button>
    );
  }
}
