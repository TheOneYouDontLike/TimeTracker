namespace App
{
    using System;
    using System.IO;
    using Nancy;

    public class SelfhostRootPathProvider : IRootPathProvider
    {
        public string GetRootPath()
        {
            var currentDirectory = new DirectoryInfo(Environment.CurrentDirectory);

            var solutionDirectory = currentDirectory.Parent.Parent.Parent.FullName;
            return solutionDirectory + @"\App";

            //if (!string.IsNullOrEmpty(_cachedRootPath))
            //    return _cachedRootPath;

            //var rootPathFound = false;
            //while (!rootPathFound)
            //{
            //    var directoriesContainingViewFolder = currentDirectory.GetDirectories(
            //              "Views", SearchOption.AllDirectories);
            //    if (directoriesContainingViewFolder.Any())
            //    {
            //        _cachedRootPath = directoriesContainingViewFolder.First().FullName;
            //        rootPathFound = true;
            //    }

            //    currentDirectory = currentDirectory.Parent;
            //}

            //return _cachedRootPath;
        }
    }
}