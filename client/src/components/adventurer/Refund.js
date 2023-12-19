import React from 'react'


export default function Refund() {

  return (
    <>
        <div className={styles.contentPane}>
            <h1 className={styles.paneTitle}>Refunds & Returns</h1>
            <p className={styles.paneText}>Welcome to our Refund & Returns Policy page. At [Your Company Name], we are committed to ensuring your satisfaction with every purchase. This policy is designed to provide you with clear information on how to request refunds or returns for products purchased on our website. Please take a moment to read through the following guidelines to understand our process better.</p>
            <div className={styles.refBox}>
                <h4 className={styles.boxTitle}>Refunds</h4>
                <label className={styles.refLabel}>Refund Eligibility:</label>
                <ol>
                <li>You may request a refund within [X] days from the date of purchase.</li>
                <li>To be eligible for a refund, the item must be in its original condition and packaging.</li>
                <li>Refunds are typically processed to the original payment method.</li>
                </ol>
                <label className={styles.refLabel}>How to Request a Refund:</label>
                <ol>
                <li>To initiate a refund request, please contact our customer support team at [Customer Support Email] or call [Customer Support Phone Number].</li>
                <li>Our team will guide you through the process and provide you with a Return Merchandise Authorization (RMA) number if necessary.</li>
                </ol>
                <label className={styles.refLabel}>Exceptions:</label>
                <ol>
                <li>Some items, such as personalized or digital products, are non-refundable.</li>
                <li>Shipping and handling fees are non-refundable unless there was an error in the shipment.</li>
                </ol>
                <label className={styles.refLabel}>Refund Processing Time:</label>
                <ol>
                <li>Refunds will be processed within [X] business days after receiving the returned item.</li>
                </ol>
                <p>[Your Company Name] reserves the right to refuse refunds if the above criteria are not met.</p>
            </div>
            <div className={styles.refBox}>
                <h4 className={styles.boxTitle}>Returns</h4>
                <label className={styles.refLabel}>Return Eligibility:</label>
                <ol>
                <li>You may request a return within [X] days from the date of purchase.</li>
                <li>The item must be in its original condition and packaging for us to accept the return.</li>
                </ol>
                <label className={styles.refLabel}>How to Initiate a Return:</label>
                <ol>
                <li>To start the return process, please contact our customer support team at [Customer Support Email] or call [Customer Support Phone Number].</li>
                <li>Our team will guide you through the necessary steps and provide you with a Return Merchandise Authorization (RMA) number if required.</li>
                </ol>
                <label className={styles.refLabel}>Restocking Fees:</label>
                <ol>
                <li>A restocking fee of [X]% may apply to certain returns. This fee helps cover processing and handling costs.</li>
                </ol>
                <label className={styles.refLabel}>Return Shipping:</label>
                <ol>
                <li>Customers are responsible for return shipping costs unless the return is due to a mistake on our part.</li>
                </ol>
                <label className={styles.refLabel}>Return Processing Time:</label>
                <ol>
                <li>Returns will be processed within [X] business days after receiving the returned item.</li>
                </ol>
                <p>[Your Company Name] reserves the right to refuse returns if the above conditions are not met.</p>
            </div>
        </div>
    </>
  )
}
