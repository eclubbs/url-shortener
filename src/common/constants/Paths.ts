import jetPaths from 'jet-paths';

const Paths = {
  _: '',
  Get: '/:key',
  Urls: {
    _: '/urls',
    Add: '/add'
  },
} as const;

export const JetPaths = jetPaths(Paths);
export default Paths;
