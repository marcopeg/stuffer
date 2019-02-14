### KitchenSink

```js
const mr = { marginRight: 10 }
const mb = { marginBottom: 10 }
;
<MobilePageStyleguidist.Wrapper>
    {(theme, width, height ) => (
        <MobilePage theme={theme} width={width} height={height}>
            <MobilePage.Header>
                header
            </MobilePage.Header>
            <MobilePage.Body withPadding>
                <p>this is a page body</p>
                {Array.apply(null, {length: 300}).map(Number.call, Number).map(i => (
                    <div key={`MobilePageExBody${i}`}>{i}</div>
                ))}
            </MobilePage.Body>
            <MobilePage.Footer>
                footer
            </MobilePage.Footer>
        </MobilePage>
    )}
</MobilePageStyleguidist.Wrapper>
```

### Small Stuff

```js
const { Button } = require('components/MobilePage')
;
<MobilePage theme="dark" width={250} height={300}>
    <MobilePage.Body withPadding>
        <p>padded page with theme</p>
        <Button>foo</Button>
    </MobilePage.Body>
</MobilePage>
```