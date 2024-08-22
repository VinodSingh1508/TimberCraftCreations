
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Carousel from 'react-bootstrap/Carousel';

function FooterModal({ show, onHide, modalType }) {


    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {(modalType && modalType === 'pp') && (
                        <>Privacy Policy</>
                    )}
                    {(modalType && modalType === 'tnc') && (
                        <>Terms &amp; Conditions</>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(modalType && modalType === 'pp') && (
                    <>
                        <p><strong>Effective Date:</strong> 01/03/2024</p>
                        <p>Welcome to TimberCraft Creations. We are committed to protecting your privacy and ensuring a secure online experience. This Privacy Policy outlines how we collect, use, and safeguard your personal information. By using our website, you consent to the practices described in this policy.</p>
                        <p><strong>1. Information We Collect</strong></p>
                        <p>We collect various types of information to provide and improve our services, including:</p>
                        <ul>
                            <li><strong>Personal Information:</strong> When you register an account, make a purchase, or contact us, we collect information such as your name, email address, phone number, and shipping address.</li>
                            <li><strong>Payment Information:</strong> We use secure payment gateways to process transactions. We do not store your credit card information; it is handled directly by our payment processors.</li>
                            <li><strong>Order Information:</strong> Details about your orders, including product choices, quantities, and customization options.</li>
                            <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP addresses, browser types, and pages visited.</li>
                        </ul>
                        <p><strong>2. How We Use Your Information</strong></p>
                        <p>We use the information we collect for the following purposes:</p>
                        <ul>
                            <li><strong>To Process Transactions:</strong> Manage and fulfill your orders, including customizing products and delivering them.</li>
                            <li><strong>To Improve Our Services:</strong> Analyze usage patterns to enhance our website and product offerings.</li>
                            <li><strong>To Communicate with You:</strong> Send order confirmations, updates, newsletters, and promotional materials if you have opted in.</li>
                            <li><strong>To Provide Customer Support:</strong> Address your inquiries and resolve any issues related to our products or services.</li>
                        </ul>
                        <p><strong>3. Data Sharing and Disclosure</strong></p>
                        <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> Trusted third parties that perform services on our behalf, such as payment processors and shipping companies. They are required to use your information only as necessary to provide these services and to protect your data.</li>
                            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or to protect our rights, property, or safety, or the rights, property, or safety of others.</li>
                        </ul>
                        <p><strong>4. Data Security</strong></p>
                        <p>We implement industry-standard security measures to protect your personal information. While we strive to protect your data, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security but will take reasonable steps to safeguard your information.</p>
                        <p><strong>5. Your Rights</strong></p>
                        <p>You have the right to:</p>
                        <ul>
                            <li><strong>Access and Update:</strong> Request access to your personal information and update it as needed.</li>
                            <li><strong>Opt-Out:</strong> Opt-out of receiving promotional communications by following the instructions in the emails or contacting us directly.</li>
                            <li><strong>Delete Data:</strong> Request the deletion of your personal information, subject to legal and contractual obligations.</li>
                        </ul>
                        <p><strong>6. Cookies and Tracking Technologies</strong></p>
                        <p>Our website uses cookies and similar technologies to enhance your browsing experience. Cookies are small files stored on your device that help us remember your preferences and track usage patterns. You can manage cookie settings through your browser.</p>
                        <p><strong>7. Third-Party Links</strong></p>
                        <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these sites. We encourage you to review their privacy policies before providing any personal information.</p>
                        <p><strong>8. Changes to This Privacy Policy</strong></p>
                        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we protect your information.</p>
                        <p><strong>9. Contact Us</strong></p>
                        <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
                        <p>TimberCraft Creations<br />343/A Haridevpur, Kolkata 700104<br />vinodsingh1508@gmail.com</p>
                    </>
                )}
                {(modalType && modalType === 'tnc') && (
                    <>
                        <p><strong>Effective Date:</strong> 01/03/2024</p>
                        <p>Welcome to TimberCraft Creations. By using our website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully. If you do not agree to these terms, please do not use our site.</p>
                        <p><strong>1. Use of Our Website</strong></p>
                        <p>You agree to use our website only for lawful purposes and in a manner that does not infringe on the rights of, or restrict or inhibit the use and enjoyment of this site by any third party. Unauthorized use of our website may give rise to a claim for damages and/or be a criminal offense.</p>
                        <p><strong>2. Intellectual Property</strong></p>
                        <p>All content on this website, including text, graphics, logos, images, and software, is the property of TimberCraft Creations or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on this site without prior written consent from TimberCraft Creations.</p>
                        <p><strong>3. Product Information</strong></p>
                        <p>We make every effort to ensure that product descriptions and prices are accurate. However, we do not guarantee that all product information is error-free. TimberCraft Creations reserves the right to correct any inaccuracies or omissions and to change or update information without prior notice.</p>
                        <p><strong>4. Orders and Payments</strong></p>
                        <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at our discretion. Payments are processed through secure payment gateways. You agree to provide accurate payment information and to pay for all products ordered.</p>
                        <p><strong>5. Shipping and Delivery</strong></p>
                        <p>Shipping costs and delivery times will vary based on your location and the products ordered. We aim to process and ship orders promptly, but we are not responsible for delays caused by shipping carriers or other factors beyond our control.</p>
                        <p><strong>6. Returns and Refunds</strong></p>
                        <p>Once you place an order, we will contact and communicate with you before commissioning the product. Once production has started, orders cannot be returned unless there is a manufacturing defect. If a manufacturing defect is found, please contact us to discuss possible remedies.</p>
                        <p><strong>7. Limitation of Liability</strong></p>
                        <p>To the fullest extent permitted by law, TimberCraft Creations shall not be liable for any indirect, incidental, special, or consequential damages, or for any loss of profits or data, arising out of or in connection with your use of our website or products. Our total liability for any claim arising from your use of the site or products shall be limited to the amount you paid for the product in question.</p>
                        <p><strong>8. Indemnification</strong></p>
                        <p>You agree to indemnify, defend, and hold harmless TimberCraft Creations, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, or expenses arising out of your use of the website or violation of these Terms and Conditions.</p>
                        <p><strong>9. Changes to Terms and Conditions</strong></p>
                        <p>We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Any changes will be posted on this page with an updated effective date. Your continued use of the site after any changes constitutes acceptance of the revised terms.</p>
                        <p><strong>10. Governing Law</strong></p>
                        <p>These Terms and Conditions are governed by and construed in accordance with the laws of [Insert Jurisdiction], without regard to its conflict of law principles. Any disputes arising from or related to these terms shall be resolved in the courts of [Insert Jurisdiction].</p>
                        <p><strong>11. Contact Us</strong></p>
                        <p>If you have any questions or concerns about these Terms and Conditions, please contact us at:</p>
                        <p>TimberCraft Creations<br />343/A Haridevpur, Kolkata 700104<br />vinodsingh1508@gmail.com</p>
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button type='button' onClick={() => onHide()}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FooterModal;
