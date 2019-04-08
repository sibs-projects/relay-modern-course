import React from 'react';
import styled from 'styled-components'
import { space, width, fontSize, color } from 'styled-system';

import { Root } from './Intro';

const Img = styled.img`
  ${width}
`;

export const Center = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.span`
  font-size: 50px;
  ${space}
`;

const Subtitle = styled.span`
  font-size: 40px;
  color: #FDAA4C;
  ${space}
`;

const MeName = styled.span`
  font-size: 20px;
  color: #25D7FD;
  ${space} 
`;

export const Cover = () => (
  <Root>
    <Center>
      <Img src={"./img/relaymodern.png"} width={150} />
      <Title mt={20}>Relay Modern</Title>
      <Subtitle mt={20}>Deep Dive</Subtitle>
      <MeName mt={100}>Sibelius Seraphini</MeName>
    </Center>
  </Root>
);
