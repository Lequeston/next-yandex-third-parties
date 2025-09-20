const React = require('react');

const Script = ({ id, dangerouslySetInnerHTML, ...props }) => {
  if (dangerouslySetInnerHTML) {
    return React.createElement('script', {
      id,
      dangerouslySetInnerHTML,
      ...props,
    });
  }
  return React.createElement('script', { id, ...props });
};

module.exports = Script;
module.exports.default = Script;
