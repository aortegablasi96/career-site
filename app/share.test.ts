import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { introduction } from '@/content/introduction';
import { projects } from '@/content/projects';
import { site } from '@/content/site';
import { shareCard, sharePicture } from './share';

/** A JPEG's width and height, read from its frame header. */
function jpegSize(file: Buffer): [number, number] {
  expect(file.readUInt16BE(0)).toBe(0xffd8);

  for (let at = 2; at < file.length; ) {
    const marker = file.readUInt16BE(at);
    const length = file.readUInt16BE(at + 2);

    // A baseline or progressive frame: height, then width.
    if (marker === 0xffc0 || marker === 0xffc2) {
      return [file.readUInt16BE(at + 7), file.readUInt16BE(at + 5)];
    }
    at += 2 + length;
  }

  throw new Error('no frame header');
}

const publicFile = (path: string) => readFileSync(new URL(`../public${path}`, import.meta.url));

// #282 and DDR-095: every view's preview shows a picture, at the shape platforms draw a large
// preview at, small enough for a crawler to fetch at once.
describe('the pictures a shared link previews with', () => {
  const { width, height } = site.share;
  const files = [site.share.card, ...projects.projects.map(({ slug }) => site.share.project(slug))];

  it('are drawn at 1.91:1, the shape a large preview takes', () => {
    expect([width, height]).toEqual([1200, 630]);
  });

  it.each(files)('%s is a JPEG at that size, within 150 KB', (path) => {
    const file = publicFile(path);

    expect(jpegSize(file)).toEqual([width, height]);
    expect(file.length).toBeLessThanOrEqual(150 * 1024);
  });

  // The card says the owner's name, positioning line and place, so its description says the same,
  // from the introduction.
  it('describe the card in the words it shows', () => {
    expect(shareCard.alt).toContain(introduction.name);
    expect(shareCard.alt).toContain(introduction.positioning);
    expect(shareCard.alt).toContain(introduction.location);
  });

  it('name a project’s picture by its slug, with the description it is given', () => {
    expect(sharePicture('numisbook', 'A coin')).toEqual({
      url: '/portfolio/numisbook/share.jpg',
      width,
      height,
      alt: 'A coin',
    });
  });
});
