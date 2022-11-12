import { GameContext } from '@hypnos/web/network';
import { Group, Stack, Text, Table, TextProps, Tooltip } from '@mantine/core';
import { useContext, useMemo } from 'react';
import { PresentationRecord } from './Presentation';

export interface ShowPointsProps {
  data: PresentationRecord[];
}

export const ShowPoints = (props: ShowPointsProps) => {
  const context = useContext(GameContext);

  return (
    <>
      <Text variant="gradient" size="lg">
        Round Summary
      </Text>
      <Table
        title="Round summary"
        horizontalSpacing="xl"
        sx={{ textAlign: 'center' }}
      >
        <thead>
          <tr>
            <td></td>
            <td></td>
            <td>
              <Text>Points</Text>
            </td>
            <td>
              <ToolTipped text="F" label="Forgery points" />
            </td>
            <td>
              <ToolTipped text="N" label="Narration points" />
            </td>
            <td>
              <ToolTipped text="G" label="Guess points" />
            </td>
            <td>
              <Text>Sum</Text>
            </td>
            <td>
              <Text>Total</Text>
            </td>
          </tr>
        </thead>
        <tbody>
          {context?.[0].round?.playerData
            .sort((a, b) => (a.points ?? 0) - (b.points ?? 0))
            .map((pd, i) => {
              const pdata = context[0].players.find(
                (p) => p.socketId === pd.playerSID
              );

              const precord = props.data.find(
                (e) => e.ownerSID === pd.playerSID
              );
              const sum = precord ? calcPoints(precord) : 0;

              return (
                <tr key={i}>
                  <td>{`${i + 1}. `}</td>
                  <td> {pdata?.name}</td>
                  <td> {pdata?.points ?? 0}</td>
                  <td>{zerofy(precord?.forgeryPoints)}</td>
                  <td>{zerofy(precord?.narrationPoints)}</td>
                  <td>{zerofy(precord?.guessPoints)}</td>
                  <td>{precord && printSum(sum)}</td>
                  <td>
                    <Text color="cyan">{(pdata?.points ?? 0) + sum}</Text>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </>
  );
};

interface ToolTippedProps {
  text: string;
  label: string;
}

const ToolTipped = (props: ToolTippedProps) => {
  return (
    <Tooltip
      withArrow
      label={props.label}
      events={{ hover: true, focus: true, touch: true }}
    >
      <Text>{props.text}</Text>
    </Tooltip>
  );
};

const printSum = (value: number) => {
  return (
    <Text align="right" color={value ? 'green' : 'red'}>
      {value ? `+${value}` : '0'}
    </Text>
  );
};

const zerofy = (value: number | undefined) => (value === 0 ? '' : value);

const calcPoints = (rec: PresentationRecord) => {
  return rec.forgeryPoints + rec.guessPoints + rec.narrationPoints;
};
