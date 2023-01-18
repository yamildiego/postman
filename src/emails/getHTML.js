module.exports = (website, from) => {
  let html01 = HTML;
  let html02 = html01.replace(/{NAME_APP}/g, website.name);
  let html03 = html02.replace(/{URL_LOGO_APP}/g, website.logo);
  let html04 = html03.replace(/{NAME}/g, from.name);
  let html05 = html04.replace(/{PHONE}/g, from.phone);
  let html06 = html05.replace(/{EMAIL}/g, from.email);
  let html07 = html06.replace(/{MESSAGE}/g, from.message);
  let html08 = html07.replace(/{CURRENT_YEAR}/g, new Date().getFullYear());
  return html08;
};

const HTML = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>{NAME_APP}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  
  <body style="margin: 0; padding: 0">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
              <td style="padding: 10px 0 30px 0">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="700"
                      style="border: 1px solid #cccccc; border-collapse: collapse">
                      <tr>
                          <td width="100%" align="center" bgcolor="#e2e2e2"
                              style="padding: 10px 0 10px 0; color: #fff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif">
                              <img src="{URL_LOGO_APP}" alt="{NAME_APP}" width="300" />
                          </td>
                      </tr>
                      <tr>
                          <td bgcolor="#ffffff" style="padding: 40px 30px 0 30px" colspan="2">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                      <td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px">
                                          <b>{NAME}</b>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td
                                          style="padding: 20px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px">
                                          {MESSAGE}
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="color: #153643; font-family: Arial, sans-serif;">
                                          <table style="margin:0 0 30px 0;">
                                              <tr>
                                                  <th style="padding: 20px 0 10px 0;">Contact information</th>
                                              </tr>
                                              <tr>
                                                  <td>Name</td>
                                                  <td>{NAME}</td>
                                              </tr>
                                              <tr>
                                                  <td>Phone</td>
                                                  <td>{PHONE}</td>
                                              </tr>
                                              <tr>
                                                  <td>Email</td>
                                                  <td>{EMAIL}</td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <tr>
                          <td bgcolor="#e2e2e2" style="padding: 10px 10px 10px 10px" colspan="2">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                      <td style="color: #fff; font-family: Arial, sans-serif; font-size: 12px" width="75%">
                                          Copyright &copy; 2021 - {CURRENT_YEAR}, {NAME_APP}. All rights reserved.<br />
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  
  </html>`;
