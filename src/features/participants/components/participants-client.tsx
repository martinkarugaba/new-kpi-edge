"use client";

import {
  ParticipantContainer,
  type ParticipantContainerProps,
} from "./client/index";

export function ParticipantsClient(props: ParticipantContainerProps) {
  return <ParticipantContainer {...props} />;
}
