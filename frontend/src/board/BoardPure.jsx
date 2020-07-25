import React from 'react';

import JXGBoard from 'jsxgraph-react-js';
import Flexbox from 'flexbox-react';

const BoardPure = ({jxgLogic}) => (
    <Flexbox justifyContent="center">
        <JXGBoard logic={jxgLogic}
                  boardAttributes={{boundingbox: [0, 0, 100, 100]}}
                  style={{border: "2px solid black"}}/>
    </Flexbox>
);

export default BoardPure;