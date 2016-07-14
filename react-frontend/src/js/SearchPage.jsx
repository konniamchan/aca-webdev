import * as React from "react";
import * as _ from "lodash";

import {
	SearchkitManager, SearchkitProvider,
	SearchBox, RefinementListFilter, MenuFilter, InputFilter, RangeFilter,
	Hits, HitsStats, NoHits, Pagination, SortingSelector,
	SelectedFilters, ResetFilters, ItemHistogramList,
	Layout, LayoutBody, LayoutResults, TopBar,
	SideBar, ActionBar, ActionBarRow, TermQuery, BoolMust
} from "searchkit";

import { PlanHitsListItem, PlanHitsGridItem } from "./components";
import { providerInputQuery, filterPremium } from "./custom_queries";
require("./index.scss");

const host = "http://ec2-52-53-175-143.us-west-1.compute.amazonaws.com:9200/plans/plan/"
const searchkit = new SearchkitManager(host)

try {

	// Set global vars for now
	window.user_input = {
		user_state: "FL",
		user_demo: "age_30_areaID_1_individual"
	}

	// const user_state = window.user_input.user_state
	// searchkit.addDefaultQuery((query)=> {
	// 	 return query.addFilter("state",
	// 		 TermQuery("state", user_state)
	// 	 )
	//  })

	// searchkit.addDefaultQuery((query)=> {
	// 	 return query.addQuery(
	// 		 filterPremium("premiums." + window.user_input.user_demo)
	// 	 )
	//  })

} //end try

catch(error) {
	console.log("Frontend Mode Only");
}



export class SearchPage extends React.Component {
	render(){
		const user_demo = window.user_input.user_demo;
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout>
		      <TopBar>
		        <SearchBox
		          autofocus={true}
							placeholder="Search plans..."
		          prefixQueryFields={["level^2","plan_name^10"]}/>
		      </TopBar>
		      <LayoutBody>
		        <SideBar>
							<MenuFilter
								id="level"
								title="Metal Level"
								field="level.raw"
								orderKey="_term"
								listComponent={ItemHistogramList}
							/>
							<InputFilter
							  id="providers"
							  title="Providers Filter"
							  placeholder="Search providers..."
								queryBuilder={providerInputQuery}
							/>
							{/*<RangeFilter
								id="premium_range"
								title="Premiums"
								field={"premiums." + user_demo}
								min={0}
								max={200}
								showHistogram={true}
								fieldOptions={{type:'nested', options:{path:'premiums'}}}
							/>*/}
		        </SideBar>
		        <LayoutResults>
		          <ActionBar>
		            <ActionBarRow>
		              <HitsStats/>
									<SortingSelector options={[
										{label:"Relevance", field:"_score", order:"desc", defaultOption:true}										
									]}/>
		            </ActionBarRow>
		            <ActionBarRow>
		              <SelectedFilters/>
		              <ResetFilters/>
		            </ActionBarRow>
		          </ActionBar>
		          <Hits
								mod="sk-hits-grid"
								hitsPerPage={10}
								itemComponent={PlanHitsGridItem}
								sourceFilter={["level", "plan_name", "url", "premiums", "state"]}
							/>
		          <NoHits/>
							<Pagination showNumbers={true}/>
		        </LayoutResults>
		      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
