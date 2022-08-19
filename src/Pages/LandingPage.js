import { Auth } from 'aws-amplify'
import logoImg from '../assets/images/logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/wms.css';
import '../css/dashboardStyle.css';

function LandingPage({data}) {
  return (
    <div>
		<header id="header">
			<div class="headerbar row">
				<div class="col-md-3">
					<div class="btn-group">
						<button class="btn dropdown-toggle1 btn-box-shadow" data-toggle="dropdown" aria-expanded="false">
							<i class="fa fa-bars"></i>
						</button>
						<ul class="dropdown-menu animation-expand dmenu">
							<li onclick="getDetails('|100001|1')">Customer Onboarding </li>
							<li onclick="getDetails('|110000')">Create Gate Entry</li>
							<li>Create PO</li>
							<li>Create SO</li>
						</ul>
					</div>
					<img id="headerLogo" src={logoImg} alt="" className="img-responsive"/>
				</div>
				<div id="displayTitle" class="col-md-6">
					
				</div>
				<div id="userInfo" class="col-md-2">
					<div class="btn-group txt-align">
						<button id="userDetails" class="logout-btn dropdown-toggle1" data-toggle="dropdown" aria-expanded="false">
							{data.FirstName} <br />
							{data.RoleDescription}
						</button>
						<ul class="dropdown-menu animation-expand ul-logout">
							<li><i class="fa fa-sign-out" aria-hidden="true"></i>Logout</li>
						</ul>
					</div>
				</div>
				<div class="col-md-1 logout-btn">
					<button onClick={() => Auth.signOut()}><i class="fa fa-sign-out" aria-hidden="true"></i>Logout</button>
				</div>
			</div>
		</header>
        <iframe id="uId" src="/EmizaWMS.html" title="iframe" un={data.UserName} fn={data.FirstName} rd={data.RoleDescription}></iframe>
    </div>
  )
}
// this is comment
export default LandingPage