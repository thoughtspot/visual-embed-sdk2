import { HostEvent } from '../../types';

export enum UiPassthroughEvent {
  addVizToPinboard = 'addVizToPinboard',
  saveAnswer = 'saveAnswer',
  getA3AnalysisColumns = 'getA3AnalysisColumns',
  getDiscoverabilityStatus = 'getDiscoverabilityStatus',
  getAvailableUiPassthroughs = 'getAvailableUiPassthroughs',
  getAnswerPageConfig = 'getAnswerPageConfig',
  getPinboardPageConfig = 'getPinboardPageConfig',
  UiPassthroughEventNotFound = 'UiPassthroughEventNotFound',
}

export type UiPassthroughContractBase = {
  [UiPassthroughEvent.addVizToPinboard]: {
    request: {
      vizId?: string;
      newVizName: string;
      newVizDescription?: string;
      pinboardId?: string;
      tabId?: string;
      newPinboardName?: string;
      newTabName?: string;
      pinFromStore?: boolean;
    };
    response: {
      pinboardId: string;
      tabId: string;
      vizId: string;
      errors?: any;
    };
  };
  [UiPassthroughEvent.saveAnswer]: {
    request: {
      name: string;
      description: string;
      vizId: string;
      isDiscoverable?: boolean;
    };
    response: {
      answerId: string,
      errors?: any;
    };
  };
  [UiPassthroughEvent.getA3AnalysisColumns]: {
    request: {
      vizId?: string;
    };
    response: {
      data?: any;
      errors?: any;
    };
  };
  [UiPassthroughEvent.getDiscoverabilityStatus]: {
    request: any;
    response: {
      shouldShowDiscoverability: boolean;
      isDiscoverabilityCheckboxUnselectedPerOrg: boolean;
    };
  };
  [UiPassthroughEvent.getAvailableUiPassthroughs]: {
    request: any;
    response: {
      keys: string[];
    };
  };
  [UiPassthroughEvent.getAnswerPageConfig]: {
    request: {
      vizId?: string;
    };
    response: any;
  };
  [UiPassthroughEvent.getPinboardPageConfig]: {
    request: any;
    response: any;
  };
  [UiPassthroughEvent.UiPassthroughEventNotFound]: {
    request: any;
    response: any;
  };
};

export type UiPassthroughRequest<T extends keyof UiPassthroughContractBase> = UiPassthroughContractBase[T]['request'];
export type UiPassthroughResponse<T extends keyof UiPassthroughContractBase> = UiPassthroughContractBase[T]['response'];

export type UiPassthroughArrayResponse<ApiName extends keyof UiPassthroughContractBase> =
  Promise<Array<{
    redId?: string;
    value?: UiPassthroughArrayResponse<ApiName>;
    error?: any;
  }>>

export type EmbedApiHostEventMapping = {
  [HostEvent.Pin]: UiPassthroughEvent.addVizToPinboard;
  [HostEvent.SaveAnswer]: UiPassthroughEvent.saveAnswer;
  'hostEventNotMapped': UiPassthroughEvent.UiPassthroughEventNotFound;
}

export type FlattenType<T> = T extends infer R ? { [K in keyof R]: R[K] } : never;

export type HostEventRequest<HostEventT extends HostEvent> =
  HostEventT extends keyof EmbedApiHostEventMapping ?
  FlattenType<UiPassthroughRequest<EmbedApiHostEventMapping[HostEventT]>> : any;

export type HostEventResponse<HostEventT extends HostEvent> =
  HostEventT extends keyof EmbedApiHostEventMapping ?
  {
    value?: UiPassthroughRequest<EmbedApiHostEventMapping[HostEventT]>
    error?: any;
  }
  : any;
