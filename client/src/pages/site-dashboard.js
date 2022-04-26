import React, { Component } from "react";
import { withRouter } from "react-router";
import bindComponentToState from "../tools/bindComponentToState";
import PagesSidebar from "../components/site-dashboard/pages-sidebar";
import PageScreenshots from "../components/site-dashboard/page-screenshots";
import OptionsSidebar from "../components/site-dashboard/options-sidebar";

class SiteDashboard extends Component {
  constructor(props) {
    super(props);
    this.props.clearSiteData();
    this.state = { isSiteDataLoaded: false };
  }

  async componentDidMount() {
    const params = { sitePath: this.props.match.params.sitePath };

    const fetchUrl = new URL(`${window.location.origin}/api/get-site`);
    console.log("Getting site");
    const siteData = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        this.props.history.push("/sites");
        return res.text();
      }
    });

    console.log("got site", siteData);
    if (typeof siteData === "object") {
      this.props.loadSiteData(siteData);
    }

    this.setState({ isSiteDataLoaded: true });
  }

  render() {
    if (this.state.isSiteDataLoaded) {
      return (
        <div className="site-dashboard">
          <PagesSidebar {...this.props} />
          <PageScreenshots {...this.props} />
          <OptionsSidebar {...this.props} />
        </div>
      );
    } else {
      return <div>Loading</div>;
    }
  }
}

SiteDashboard = bindComponentToState(SiteDashboard);
export default withRouter(SiteDashboard);
