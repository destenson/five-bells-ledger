define({
  "name": "five-bells-ledger",
  "version": "16.1.0",
  "description": "Five Bells ledger reference implementation",
  "title": "Interledger Reference Ledger API",
  "url": "https://acme-ledger.example",
  "order": [
    "Transfer_Methods",
    "PutTransfer",
    "PutTransferFulfillment",
    "GetTransfer",
    "GetTransferByExecutionCondition",
    "GetTransferState",
    "GetTransferFulfillment",
    "Account_Methods",
    "PutAccount",
    "GetAccount",
    "SubscribeAccountTransfers",
    "Metadata_Methods"
  ],
  "header": {
    "title": "Intro and Data Types",
    "content": "<!-- this intro sourced from scripts/apidoc_intro.md.ejs: changes to the .md file directly will be lost! -->\n<p>Five Bells Ledger is a JavaScript reference implementation of an ILP-compatible ledger with a RESTful API. It demonstrates one possible way that a ledger could expose conditional transfers to be used as part of the Interledger Protocol. It also has some basic functionality that any ledger might have.</p>\n<h3>Contents</h3>\n<ul>\n<li>Data Structures:\n<ul>\n<li><a href=\"#transfer_object\">Transfer Object</a></li>\n<li><a href=\"#account_object\">Account Object</a></li>\n<li><a href=\"#notification_object\">Notification Object</a></li>\n</ul>\n</li>\n<li>Other Concepts:\n<ul>\n<li><a href=\"#authentication\">Authentication</a></li>\n<li><a href=\"#cryptoconditions\">Crypto-Conditions</a></li>\n<li><a href=\"#environment_variables\">Environment Variables</a></li>\n</ul>\n</li>\n</ul>\n<h2>Transfer Object</h2>\n<p><a id='transfer_object'></a></p>\n<p>A transfer is the core action of the Five Bells Ledger. It can have multiple debits and multiple credits. (The sum of all credits must equal the sum of all debits.) It can be conditional upon a supplied crypto-condition, in which case it executes automatically when presented with the fulfillment for the condition. (Assuming the transfer has not expired or been canceled first.) If no crypto-condition is specified, the transfer is unconditional, and executes as soon as it is prepared.</p>\n<p>A transfer object can have the following fields:</p>\n<!-- This table sourced from the five-bells-shared TransferTemplate.json schema. -->\n<table>\n<thead>\n<tr>\n<th>Name</th>\n<th>Type</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>additional_info</td>\n<td>object</td>\n<td><em>Optional</em> Includes part_of_payment, case, etc.</td>\n</tr>\n<tr>\n<td><em>additional_info.</em> cases</td>\n<td>array[uri string]</td>\n<td><em>Optional</em> References to the notary Cases</td>\n</tr>\n<tr>\n<td>cancellation_condition</td>\n<td>string</td>\n<td><em>Optional</em> The condition for executing the transfer</td>\n</tr>\n<tr>\n<td>credits</td>\n<td>array</td>\n<td><em>Optional</em> Funds that come out of the transfer</td>\n</tr>\n<tr>\n<td>credits[]</td>\n<td>object</td>\n<td>A defined quantity of an asset optionally located on a specified ledger.</td>\n</tr>\n<tr>\n<td><em>credits[].</em> account</td>\n<td>uri string, null</td>\n<td>Account holding the funds</td>\n</tr>\n<tr>\n<td><em>credits[].</em> amount</td>\n<td>string</td>\n<td>Amount as decimal</td>\n</tr>\n<tr>\n<td><em>credits[].</em> authorized</td>\n<td>boolean</td>\n<td><em>Optional</em> Indicates whether the debits or credits have been authorized by the required account holder</td>\n</tr>\n<tr>\n<td><em>credits[].</em> invoice</td>\n<td>uri string</td>\n<td><em>Optional</em> Unique invoice URI - the ledger will only allow one transfer referencing a given invoice ID</td>\n</tr>\n<tr>\n<td><em>credits[].</em> memo</td>\n<td>object</td>\n<td><em>Optional</em> Additional information related to the credit</td>\n</tr>\n<tr>\n<td><em>credits[].</em> rejected</td>\n<td>boolean</td>\n<td><em>Optional</em> Indicates whether the credit has been rejected by the required account holder</td>\n</tr>\n<tr>\n<td><em>credits[].</em> rejection_message</td>\n<td>string</td>\n<td><em>Optional</em> The reason the credit was rejected</td>\n</tr>\n<tr>\n<td>debits</td>\n<td>array</td>\n<td><em>Optional</em> Funds that go into the transfer</td>\n</tr>\n<tr>\n<td>debits[]</td>\n<td>object</td>\n<td>A defined quantity of an asset optionally located on a specified ledger.</td>\n</tr>\n<tr>\n<td><em>debits[].</em> account</td>\n<td>uri string, null</td>\n<td>Account holding the funds</td>\n</tr>\n<tr>\n<td><em>debits[].</em> amount</td>\n<td>string</td>\n<td>Amount as decimal</td>\n</tr>\n<tr>\n<td><em>debits[].</em> authorized</td>\n<td>boolean</td>\n<td><em>Optional</em> Indicates whether the debits or credits have been authorized by the required account holder</td>\n</tr>\n<tr>\n<td><em>debits[].</em> invoice</td>\n<td>uri string</td>\n<td><em>Optional</em> Unique invoice URI - the ledger will only allow one transfer referencing a given invoice ID</td>\n</tr>\n<tr>\n<td><em>debits[].</em> memo</td>\n<td>object</td>\n<td><em>Optional</em> Additional information related to the credit</td>\n</tr>\n<tr>\n<td><em>debits[].</em> rejected</td>\n<td>boolean</td>\n<td><em>Optional</em> Indicates whether the credit has been rejected by the required account holder</td>\n</tr>\n<tr>\n<td><em>debits[].</em> rejection_message</td>\n<td>string</td>\n<td><em>Optional</em> The reason the credit was rejected</td>\n</tr>\n<tr>\n<td>execution_condition</td>\n<td>string</td>\n<td><em>Optional</em> The condition for executing the transfer</td>\n</tr>\n<tr>\n<td>expires_at</td>\n<td>date-time string</td>\n<td><em>Optional</em> The date when the transfer expires and will be rejected by the ledger</td>\n</tr>\n<tr>\n<td>expiry_duration</td>\n<td>string</td>\n<td><em>Optional</em> Time in seconds between proposed_at and expires_at. Set in quotes from payment systems but not valid in actual transfers</td>\n</tr>\n<tr>\n<td>id</td>\n<td>uri string</td>\n<td><em>Optional</em> Resource identifier</td>\n</tr>\n<tr>\n<td>ledger</td>\n<td>uri string</td>\n<td><em>Optional</em> The ledger where the transfer will take place</td>\n</tr>\n<tr>\n<td>rejection_reason</td>\n<td>string</td>\n<td><em>Optional</em> The reason the transfer was rejected</td>\n</tr>\n<tr>\n<td>state</td>\n<td>string</td>\n<td><em>Optional</em> The current state of the transfer (informational only)</td>\n</tr>\n<tr>\n<td>timeline</td>\n<td>object</td>\n<td><em>Optional</em> Timeline of the transfer's state transitions</td>\n</tr>\n<tr>\n<td><em>timeline.</em> executed_at</td>\n<td>date-time string</td>\n<td><em>Optional</em> An informational field added by the ledger to indicate when the transfer was originally executed</td>\n</tr>\n<tr>\n<td><em>timeline.</em> pre_executed_at</td>\n<td>date-time string</td>\n<td><em>Optional</em> An informational field added by the ledger to indicate when the transfer was originally pre_executed</td>\n</tr>\n<tr>\n<td><em>timeline.</em> pre_prepared_at</td>\n<td>date-time string</td>\n<td><em>Optional</em> An informational field added by the ledger to indicate when the transfer was originally pre_prepared</td>\n</tr>\n<tr>\n<td><em>timeline.</em> prepared_at</td>\n<td>date-time string</td>\n<td><em>Optional</em> An informational field added by the ledger to indicate when the transfer was originally prepared</td>\n</tr>\n<tr>\n<td><em>timeline.</em> proposed_at</td>\n<td>date-time string</td>\n<td><em>Optional</em> An informational field added by the ledger to indicate when the transfer was originally proposed</td>\n</tr>\n<tr>\n<td><em>timeline.</em> rejected_at</td>\n<td>date-time string</td>\n<td><em>Optional</em> An informational field added by the ledger to indicate when the transfer was originally rejected</td>\n</tr>\n</tbody>\n</table>\n<h2>Account Object</h2>\n<p><a id='account_object'></a></p>\n<p>An account object represents one balance in the ledger, a means of authentication to access that balance, and some metadata about it.</p>\n<p>An account object can have the following fields:</p>\n<!-- This table sourced from the five-bells-shared Account.json schema. -->\n<table>\n<thead>\n<tr>\n<th>Name</th>\n<th>Type</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>name</td>\n<td>string</td>\n<td>Name of the account</td>\n</tr>\n<tr>\n<td>balance</td>\n<td>string</td>\n<td><em>Optional</em> Balance as decimal</td>\n</tr>\n<tr>\n<td>connector</td>\n<td>uri string</td>\n<td><em>Optional</em> A link to the account holder's API</td>\n</tr>\n<tr>\n<td>fingerprint</td>\n<td>string</td>\n<td><em>Optional</em> A fingerprint of the account's client certificate</td>\n</tr>\n<tr>\n<td>id</td>\n<td>uri string</td>\n<td><em>Optional</em> Unique ID</td>\n</tr>\n<tr>\n<td>is_admin</td>\n<td>boolean</td>\n<td><em>Optional</em> admin flag</td>\n</tr>\n<tr>\n<td>is_disabled</td>\n<td>boolean</td>\n<td><em>Optional</em> Admin users may disable/enable an account</td>\n</tr>\n<tr>\n<td>ledger</td>\n<td>uri string</td>\n<td><em>Optional</em> A link the the account's ledger</td>\n</tr>\n<tr>\n<td>minimum_allowed_balance</td>\n<td>string</td>\n<td><em>Optional</em> The minimum balance permitted on this account</td>\n</tr>\n<tr>\n<td>password</td>\n<td>string</td>\n<td><em>Optional</em> Account password</td>\n</tr>\n<tr>\n<td>public_key</td>\n<td>string</td>\n<td><em>Optional</em> Account public key for signing HTTP requests</td>\n</tr>\n</tbody>\n</table>\n<h2>Notification Object</h2>\n<p><a id='notification_object'></a></p>\n<p>The Ledger pushes a notification object to WebSocket clients when a transfer changes state. This notification is sent <em>at most once</em> for each state change. If a transfer advances through multiple steps as part of a single operation, the notification only describes the final state of the transfer. (For example, if an unconditional transfer is proposed, prepared, and executed by one request, there is only a notification that the transfer has reached the &quot;executed&quot; state.)</p>\n<p>A notification object can have the following fields:</p>\n<!-- This table sourced from the five-bells-shared Notification.json schema. -->\n<table>\n<thead>\n<tr>\n<th>Name</th>\n<th>Type</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>id</td>\n<td>uri string</td>\n<td>Unique identifier for this notification</td>\n</tr>\n<tr>\n<td>event</td>\n<td>string</td>\n<td>Event identifier for the type of event</td>\n</tr>\n<tr>\n<td>resource</td>\n<td>object</td>\n<td>Transfer that is the subject of the notification</td>\n</tr>\n<tr>\n<td>related_resources</td>\n<td>object</td>\n<td><em>Optional</em> Additional resources relevant to the event</td>\n</tr>\n<tr>\n<td><em>related_resources.</em> cancellation_condition_fulfillment</td>\n<td>string</td>\n<td><em>Optional</em> Proof of condition completion</td>\n</tr>\n<tr>\n<td><em>related_resources.</em> execution_condition_fulfillment</td>\n<td>string</td>\n<td><em>Optional</em> Proof of condition completion</td>\n</tr>\n<tr>\n<td>signature</td>\n<td>object</td>\n<td><em>Optional</em> The signature of the notification</td>\n</tr>\n<tr>\n<td><em>signature.</em> additionalProperties</td>\n<td>object</td>\n<td><em>Optional</em></td>\n</tr>\n<tr>\n<td><em>signature.</em> algorithm</td>\n<td>string</td>\n<td><em>Optional</em> Signature algorithm ID.</td>\n</tr>\n<tr>\n<td><em>signature.</em> publicKey</td>\n<td>object</td>\n<td><em>Optional</em> Public key object.</td>\n</tr>\n<tr>\n<td><em>signature.publicKey.</em> additionalProperties</td>\n<td>object</td>\n<td><em>Optional</em></td>\n</tr>\n<tr>\n<td><em>signature.publicKey.</em> curve</td>\n<td>string</td>\n<td><em>Optional</em> EC curve ID</td>\n</tr>\n<tr>\n<td><em>signature.publicKey.</em> required</td>\n<td>object</td>\n<td><em>Optional</em></td>\n</tr>\n<tr>\n<td><em>signature.publicKey.</em> type</td>\n<td>string</td>\n<td><em>Optional</em> EC key type indicator.</td>\n</tr>\n<tr>\n<td><em>signature.publicKey.</em> x</td>\n<td>string</td>\n<td><em>Optional</em> EC curve point X.</td>\n</tr>\n<tr>\n<td><em>signature.publicKey.</em> y</td>\n<td>string</td>\n<td><em>Optional</em> EC curve point Y.</td>\n</tr>\n<tr>\n<td><em>signature.publicKey.</em> e</td>\n<td>string</td>\n<td><em>Optional</em> RSA exponent.</td>\n</tr>\n<tr>\n<td><em>signature.publicKey.</em> n</td>\n<td>string</td>\n<td><em>Optional</em> RSA modulus.</td>\n</tr>\n<tr>\n<td><em>signature.publicKey.</em> type</td>\n<td>string</td>\n<td><em>Optional</em> RSA key type indicator.</td>\n</tr>\n<tr>\n<td><em>signature.</em> required</td>\n<td>object</td>\n<td><em>Optional</em></td>\n</tr>\n<tr>\n<td><em>signature.</em> value</td>\n<td>string</td>\n<td><em>Optional</em> The signature data.</td>\n</tr>\n<tr>\n<td>subscription</td>\n<td>uri string</td>\n<td><em>Optional</em> The subscription this notification corresponds to</td>\n</tr>\n</tbody>\n</table>\n<h2>Crypto-Conditions</h2>\n<p><a id='cryptoconditions'></a></p>\n<p>The <a href=\"https://github.com/interledger/rfcs/tree/master/0002-crypto-conditions\">Crypto-Conditions spec</a> defines standard formats for <em>conditions</em> and <em>fulfillments</em>.</p>\n<p>Conditions are distributable event descriptions, and fulfillments are cryptographically verifiable messages that prove an event occurred. If you transmit a fulfillment, then everyone who has the corresponding condition can agree that the condition has been met.</p>\n<p>In the Five Bells Ledger, we use crypto-conditions to control the execution or cancellation of conditional transfers. The ledger supports conditions and fulfillments in string format.</p>\n<p>The Crypto-Conditions specification anticipates that it will need to expand to keep up with changes in the field of cryptography, so conditions always define which rules and algorithms are necessary to verify the fulfillment. Implementations can use the condition's feature list to determine if they can properly process the fulfillment, without having seen the fulfillment itself.</p>\n<p>Example condition in string format:</p>\n<pre><code>cc:0:3:dB-8fb14MdO75Brp_Pvh4d7ganckilrRl13RS_UmrXA:66\n</code></pre>\n<p>Example fulfillment in string format:</p>\n<pre><code>cf:0:VGhlIG9ubHkgYmFzaXMgZm9yIGdvb2QgU29jaWV0eSBpcyB1bmxpbWl0ZWQgY3JlZGl0LuKAlE9zY2FyIFdpbGRl\n</code></pre>\n<h2>Authentication</h2>\n<p><a id='authentication'></a></p>\n<p>The Five Bells Ledger supports two kinds of authentication: HTTP Basic, or client-side certificates. HTTP Basic auth is good for development, but provides very limited security. Client certificates can be complex to set up, but allow many secure configurations.</p>\n<h3>HTTP Basic Auth</h3>\n<p><a href=\"https://tools.ietf.org/html/rfc2617\">HTTP Basic Auth</a> is enabled by default. To authorize a request, specify the <code>Authorization</code> header. Your authentication determines which permissions you have:</p>\n<ul>\n<li>No authentication is necessary for some methods, such as <a href=\"#api-Metadata_Methods-GetMetadata\">Get Server Metadata</a>.</li>\n<li>Account-level authentication is necessary for most operations, such as getting account details or preparing transfers. Account credentials are defined by the <code>name</code> and <code>password</code> fields of the <a href=\"#account_object\">account object</a>.</li>\n<li>Admin-level authentication is necessary for some operations, such as creating new accounts. Admin credentials are defined by <a href=\"#environment_variables\">environment variables</a> when the server is started. You can also flag an account as admin to give that account's credentials admin powers.</li>\n</ul>\n<h2>Environment Variables</h2>\n<p><a id='environment_variables'></a></p>\n<p>Use the following environment variables to configure the service when run:</p>\n<ul>\n<li><code>LEDGER_DB_URI</code> (required; e.g.: <code>mysql://root:password@localhost/fivebells</code>) URI for connecting to a database. Defaults to <code>sqlite</code> if no database is set.</li>\n<li><code>LEDGER_DB_SYNC</code> (default: <code>0</code>) whether or not to run the SQL setup scripts for the database</li>\n<li><code>LEDGER_PORT</code> (default: <code>3000</code>) Port that Five Bells Ledger will listen on.</li>\n<li><code>LEDGER_BIND_IP</code> (default: <code>0.0.0.0</code>) IP that Five Bells Ledger will bind to.</li>\n<li><code>LEDGER_HOSTNAME</code> (default: <em>[your hostname]</em>) Publicly visible hostname. This is important for things like generating globally unique IDs. Make sure this is a hostname that all your clients will be able to see. The default should be fine for local testing.</li>\n<li><code>LEDGER_ILP_PREFIX</code> (default: none) ILP prefix for accounts on this ledger, included in the ledger's metadata. Used by plugins to set their ILP prefix.</li>\n<li><code>LEDGER_PUBLIC_PORT</code> (default: <code>$PORT</code>) Publicly visible port. You can set this if your public port differs from the listening port, e.g. because the ledger is running behind a proxy.</li>\n<li><code>LEDGER_PUBLIC_HTTPS</code> (default: <code>''</code>) Whether or not the publicly visible instance of Five Bells Ledger is using HTTPS.</li>\n<li><code>LEDGER_ADMIN_USER</code> (default: <code>'admin'</code>) The admin account's username (an admin user can create/modify accounts).</li>\n<li><code>LEDGER_ADMIN_PASS</code> (default: none) The admin account's password.</li>\n<li><code>LEDGER_ADMIN_FINGERPRINT</code> (default: none) The admin account's TLS certificate fingerprint if using TLS Client Certificate Auth.</li>\n<li><code>LEDGER_AUTH_BASIC_ENABLED</code> (default <code>1</code>) whether or not to allow HTTP basic authentication.</li>\n<li><code>LEDGER_AUTH_HTTP_SIGNATURE_ENABLED</code> (default <code>1</code>) whether or not to allow HTTP signature authentication.</li>\n<li><code>LEDGER_AUTH_CLIENT_CERT_ENABLED</code> (default <code>0</code>) whether or not to allow TLS Client Certificate authentication (requires HTTPS).</li>\n<li><code>LEDGER_USE_HTTPS</code> (default <code>0</code>) whether or not to run the server using HTTPS.</li>\n<li><code>LEDGER_TLS_KEY</code> (default: none) the path to the server private key file. Required if using HTTPS.</li>\n<li><code>LEDGER_TLS_CERTIFICATE</code> (default: none) the path to the server certificate file. Required if using HTTPS.</li>\n<li><code>LEDGER_TLS_CRL</code> (default: none) the path to the server certificate revokation list file. Optional if using HTTPS.</li>\n<li><code>LEDGER_TLS_CA</code> (default: none) the path to a trusted certificate to be used in addition to using the <a href=\"https://github.com/nodejs/node/blob/v4.3.0/src/node_root_certs.h\">default list</a>. Optional if using HTTPS.</li>\n<li><code>LEDGER_SIGNING_PRIVATE_KEY</code> (default: none) the path to the file containing the private key used to sign ledger notifications.</li>\n<li><code>LEDGER_SIGNING_PUBLIC_KEY</code> (default: none) the path to the file containing the public key for notification signatures.</li>\n<li><code>LEDGER_FEATURE_CREDIT_AUTH</code> (default: <code>0</code>) whether or not to require credits to be authorized.</li>\n<li><code>LEDGER_CURRENCY_CODE</code> (default: none) ISO 4217 currency code</li>\n<li><code>LEDGER_CURRENCY_SYMBOL</code> (default: none) currency symbol</li>\n<li><code>LEDGER_AMOUNT_PRECISION</code> (default: <code>10</code>) the total precision allowed in amounts</li>\n<li><code>LEDGER_AMOUNT_SCALE</code> (default: <code>2</code>) the number of digits allowed in amounts to the right of the decimal place</li>\n<li><code>LEDGER_LOG_LEVEL</code> (default: <code>info</code>) the allowed levels in order of verbosity are <code>fatal</code>, <code>error</code>, <code>warn</code>, <code>info</code>, <code>debug</code>, and <code>trace</code></li>\n<li><code>LEDGER_RECOMMENDED_CONNECTORS</code> (default: <code>'*'</code>) a comma-delimited list of connector usernames</li>\n</ul>\n"
  },
  "sampleUrl": false,
  "apidoc": "0.2.0",
  "generator": {
    "name": "apidoc",
    "time": "2016-09-21T16:43:49.408Z",
    "url": "http://apidocjs.com",
    "version": "0.13.2"
  }
});
