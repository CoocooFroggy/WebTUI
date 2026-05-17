# WebTUI

A React component library for building websites with a Terminal UI aesthetic.

## Running the Demo

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Installation

```bash
npm install webtui
```

WebTUI requires React 18+.

---

## Quick Start

Wrap your app in `TUIRoot`. Everything inside inherits the monospace font, theme colors, and CSS variables.

```tsx
import { TUIRoot, Container, Text } from 'webtui'

export default function App() {
  return (
    <TUIRoot theme="mocha">
      <Container border="single" title="Hello" padding={[1, 2]}>
        <Text variant="accent">Welcome to WebTUI</Text>
      </Container>
    </TUIRoot>
  )
}
```

## Usage

Import components from the library:

```tsx
import { /* components */ } from 'webtui'
```
