/**
 * Copyright (c) 2023
 *
 * Embed ThoughtSpot Sage
 * @summary TS Sage embed
 * @author Mourya Balabhadra <mourya.balabhadra@thoughtspot.com>
 */

import { DOMSelector, Param, ViewConfig } from '../types';
import { getQueryParamString } from '../utils';
import { V1Embed } from './ts-embed';

/**
 * Configuration for search options
 */
export interface SearchOptions {
    /**
     * The query string to pass for Natural Language Search.
     */
    searchQuery: string;
    /**
     * Boolean to define if the search should be executed or not.
     * If it is executed, the focus is placed on the results.
     * If it’s not executed, the focus is placed at the end of
     * the token string in the search bar.
     */
    executeSearch?: boolean;
}

/**
 * The configuration attributes for the embedded Natural language search view. Based on
 * GPT and LLM.
 * @version: SDK: 1.23.0 | ThoughtSpot: 9.8.0.cl, 9.8.0.sw
 * @group Embed components
 */
export interface SageViewConfig
    extends Omit<
        ViewConfig,
        'hiddenHomepageModules' | 'hiddenHomeLeftNavItems' | 'hiddenTabs' | 'visibleTabs' | 'reorderedHomepageModules'
    > {
    /**
     * If set to true, a list of Liveboard and Answers related
     * to the natural language search will be shown below the
     * AI generated answer.
     * @deprecated Currently Liveboard and Answers related
     * to the natural language search will not be shown for sage
     * embed
     */
    showObjectResults?: boolean;
    /**
     * flag used by the TS product tour page to show the blue search bar
     * even after the search is completed. This is different from Thoughtspot Embedded
     * Sage Embed experience where it mimics closer to the non-embed case.
     * The Sample questions container is collapsed when this value is set after
     * does a search.
     * @version SDK: 1.26.0 | Thoughtspot: 9.8.0.cl
     * @hidden
     */
    isProductTour?: boolean;
    /**
     * Show or hide the search bar title.
     * @version SDK: 1.29.0 | Thoughtspot: 9.8.0.cl, 9.8.0.sw
     * @deprecated Thoughtspot: 9.10.0.cl | search bar doesn't have the title from 9.10.0.cl
     */
    hideSearchBarTitle?: boolean;
    /**
     * Show or hide the Answer header, that is, the `AI Answer` title
     * at the top of the Answer page.
     * @version SDK: 1.26.0 | Thoughtspot: 9.10.0.cl
     */
    hideSageAnswerHeader?: boolean;
    /**
     * Disable the worksheet selection option.
     * @version SDK: 1.26.0 | Thoughtspot: 9.8.0.cl, 9.8.0.sw
     */
    disableWorksheetChange?: boolean;
    /**
     * Hide the worksheet selection panel.
     * @version SDK: 1.26.0 | Thoughtspot: 9.8.0.cl, 9.8.0.sw
     */
    hideWorksheetSelector?: boolean;
    /**
     * Show or hide autocomplete suggestions for the search query string.
     * @version SDK: 1.26.0 | Thoughtspot: 9.8.0.cl, 9.8.0.sw
     */
    hideAutocompleteSuggestions?: boolean;
    /**
     * Show or hide autocomplete suggestions for the search query string.
     * @deprecated
     * Currently, the object suggestions will not be shown for Natural Language Search.
     * You can use {@link hideAutocompleteSuggestions} instead.
     */
    showObjectSuggestions?: boolean;
    /**
     * Show or hide sample questions.
     * The sample questions are autogenerated based on the worksheet
     * selected for the search operation.
     * @version SDK: 1.26.0 | Thoughtspot: 9.8.0.cl, 9.8.0.sw
     */
    hideSampleQuestions?: boolean;
    /**
     * The data source GUID (Worksheet GUID) to set on load.
     */
    dataSource?: string;
    /**
     * Includes the following properties:
     *
     * `searchQuery`: The search query string to pass in the search bar.
     * Supports Natural Language Search queries.
     *
     * `executeSearch`: Boolean to define if the search should be executed or not.
     * If it is executed, the focus is placed on the results.
     * If it’s not executed, the focus is placed at the end of
     * the token string in the search bar.
     * @example
     * ```js
     * searchOptions: {
     *    searchQuery: 'average sales by country and product type',
     *    executeSearch: true,
     * }
     * ```
     * @version SDK: 1.26.0 | Thoughtspot: 9.8.0.cl, 9.8.0.sw
     */
    searchOptions?: SearchOptions;
}
/**
 * Embed ThoughtSpot LLM and GPT-based Natural Language Search component.
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
        viewConfig.embedComponentType = 'SageEmbed';
        super(domSelector, viewConfig);
    }

    /**
     * Constructs a map of parameters to be passed on to the
     * embedded Eureka or Sage search page.
     * @returns {string} query string
     */
    protected getEmbedParams(): string {
        const {
            disableWorksheetChange,
            hideWorksheetSelector,
            showObjectSuggestions,
            hideSampleQuestions,
            isProductTour,
            hideSageAnswerHeader,
            hideAutocompleteSuggestions,
        } = this.viewConfig;

        const params = this.getBaseQueryParams();
        params[Param.IsSageEmbed] = true;
        params[Param.DisableWorksheetChange] = !!disableWorksheetChange;
        params[Param.HideWorksheetSelector] = !!hideWorksheetSelector;
        params[Param.HideEurekaSuggestions] = !!hideAutocompleteSuggestions;
        if (showObjectSuggestions) {
            params[Param.HideEurekaSuggestions] = !showObjectSuggestions;
            // support backwards compatibility
        }
        params[Param.HideSampleQuestions] = !!hideSampleQuestions;
        params[Param.IsProductTour] = !!isProductTour;
        params[Param.HideSageAnswerHeader] = !!hideSageAnswerHeader;

        return getQueryParamString(params, true);
    }

    /**
     * Construct the URL of the embedded ThoughtSpot sage to be
     * loaded in the iframe
     * @returns {string} iframe url
     */
    public getIFrameSrc(): string {
        const path = 'eureka';
        const postHashObj = {};
        const tsPostHashParams = this.getThoughtSpotPostUrlParams();
        const {
            dataSource, searchOptions,
        } = this.viewConfig;

        if (dataSource) postHashObj[Param.WorksheetId] = dataSource;
        if (searchOptions?.searchQuery && searchOptions.executeSearch) {
            postHashObj[Param.executeSearch] = true;
        }

        let sagePostHashParams = new URLSearchParams(postHashObj).toString();
        if (sagePostHashParams) sagePostHashParams = `${tsPostHashParams ? '&' : '?'}${sagePostHashParams}`;
        if (searchOptions?.searchQuery) sagePostHashParams += `${sagePostHashParams ? '&' : '?'}${[Param.Query]}=${encodeURIComponent(searchOptions.searchQuery)}`;
        // use encodeURIComponent for query instead of URLSearchParams
        // as it adds + instead of %20 for spaces
        return `${this.getRootIframeSrc()}/embed/${path}${tsPostHashParams}${sagePostHashParams}`;
    }

    /**
     * Render the embedded ThoughtSpot Sage
     * @returns {SageEmbed} Eureka/Sage embed
     */
    public async render(): Promise<SageEmbed> {
        super.render();

        const src = this.getIFrameSrc();
        await this.renderV1Embed(src);

        return this;
    }
}
