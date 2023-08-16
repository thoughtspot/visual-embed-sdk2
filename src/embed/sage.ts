/**
 * Copyright (c) 2023
 *
 * Embed ThoughtSpot Sage
 *
 * @summary TS Sage embed
 * @author Mourya Balabhadra <mourya.balabhadra@thoughtspot.com>
 */

import {
    Action, DOMSelector, Param, ViewConfig,
} from '../types';
import { getQueryParamString } from '../utils';
import { V1Embed } from './ts-embed';

/**
 * Configuration for search options
 */
export interface SearchOptions {
    /**
     * The tml string to load the answer
     */
    searchQuery: string;
    /**
     * Boolean to determine if the search should be executed or not.
     * if it is executed, put the focus on the results.
     * if it’s not executed, put the focus in the search bar - at the end of
     * the tokens
     */
    executeSearch?: boolean;
}

/**
 * The configuration attributes for the embedded Natural language search view. Based on
 * GPT and LLM.
 *
 * @version: SDK: 1.23.0 | ThoughtSpot: 9.4.0.cl, 9.5.1-sw
 * @group Embed components
 */
export interface SageViewConfig extends ViewConfig {
    /**
     * If set to true, object results are shown.
     */
    showObjectResults?: boolean;
    /**
     * flag to disable changing worksheet. default false.
     */
    disableWorksheetChange?: boolean,
    /**
     * flag to hide worksheet selector. default false.
     */
    hideWorksheetSelector?: boolean,
    /**
     * If set to true, the object search suggestions are not shown
     *
     */
    showObjectSuggestions?: boolean;
    /**
     * The query string to pre-fill in natual language search bar
     */
    searchQuery?: string;
    /**
     * If set to true, sample questions would be hidden to user.
     * These sample questions are autogenerated based on selected datasource.
     */
    hideSampleQuestions?: boolean;
    /**
     * The data source GUID to set on load.
     */
    dataSource?: string;
    /**
     * Configuration for search options
     */
    searchOptions?: SearchOptions;

}
export const HiddenActionItemByDefaultForSageEmbed = [
    Action.Save,
    Action.Pin,
    Action.EditACopy,
    Action.SaveAsView,
    Action.UpdateTML,
    Action.EditTML,
    Action.AnswerDelete,
    Action.Share,
];
/**
 * Embed ThoughtSpot LLM and GPT based natural language search component.
 *
 * @version: SDK: 1.23.0 | ThoughtSpot: 9.4.0.cl, 9.5.1-sw
 * @group Embed components
 */
export class SageEmbed extends V1Embed {
    /**
     * The view configuration for the embedded ThoughtSpot sage.
     *
     */
    protected viewConfig: SageViewConfig;

    // eslint-disable-next-line no-useless-constructor
    constructor(domSelector: DOMSelector, viewConfig: SageViewConfig) {
        super(domSelector, viewConfig);
    }

    /**
     * Constructs a map of parameters to be passed on to the
     * embedded Eureka or Sage search page.
     *
     * @returns {string} query string
     */
    protected getEmbedParams(): string {
        const {
            showObjectResults,
            disableWorksheetChange,
            hideWorksheetSelector,
            showObjectSuggestions,
            hideSampleQuestions,
        } = this.viewConfig;

        const params = this.getBaseQueryParams();
        params[Param.EmbedApp] = true;
        params[Param.HideEurekaResults] = !showObjectResults;
        params[Param.IsSageEmbed] = true;
        params[Param.DisableWorksheetChange] = !!disableWorksheetChange;
        params[Param.HideWorksheetSelector] = !!hideWorksheetSelector;
        params[Param.HideEurekaSuggestions] = !showObjectSuggestions;
        params[Param.HideSampleQuestions] = !!hideSampleQuestions;
        params[Param.HideActions] = [
            ...(params[Param.HideActions] ?? []),
            ...HiddenActionItemByDefaultForSageEmbed,
        ];

        return getQueryParamString(params, true);
    }

    /**
     * Construct the URL of the embedded ThoughtSpot sage to be
     * loaded in the iframe
     *
     * @returns {string} iframe url
     */
    private getIFrameSrc() {
        const path = 'eureka';
        const postHashObj = {};
        const tsPostHashParams = this.getThoughtSpotPostUrlParams();
        const {
            dataSource, searchOptions,
        } = this.viewConfig;

        if (dataSource) postHashObj[Param.WorksheetId] = dataSource;
        if (searchOptions?.searchQuery) {
            postHashObj[Param.Query] = searchOptions?.searchQuery;
            if (searchOptions.executeSearch) {
                postHashObj[Param.executeSearch] = true;
            }
        }
        let sagePostHashParams = new URLSearchParams(postHashObj).toString();
        if (sagePostHashParams) sagePostHashParams = `${tsPostHashParams ? '&' : '?'}${sagePostHashParams}`;

        return `${this.getRootIframeSrc()}/embed/${path}${tsPostHashParams}${sagePostHashParams}`;
    }

    /**
     * Render the embedded ThoughtSpot Sage
     *
     * @returns {SageEmbed} Eureka/Sage embed
     */
    public render(): SageEmbed {
        super.render();

        const src = this.getIFrameSrc();
        this.renderV1Embed(src);

        return this;
    }
}
